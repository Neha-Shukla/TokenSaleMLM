// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPriceFeed {
    function latestAnswer() external view returns (uint256);

    function decimals() external view returns (uint256);
}

contract TokenSale {
    address public priceFeed = 0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526;
    struct User {
        uint256 levelIncome;
        uint256 referralIncome;
        address referrer;
        bool tokensReceived;
    }

    uint256 private levelsIncome = 500 ether;
    bool public isWithdrawEnabled = false;
    address public owner;

    mapping(address => User) public users;
    IERC20 public token;

    uint256 price = 6 ether;
    uint256 tokenToBeSent = 5000 ether;

    constructor(uint256 _price, address _priceFeed, IERC20 _token) {
        price = _price;
        priceFeed = _priceFeed;
        token = _token;
        owner = msg.sender;
        users[msg.sender].referrer = address(this);
    }

    function setToken(IERC20 newToken) external {
        require(msg.sender == owner, "You are not an owner");
        token = newToken;
    }

    function enableWithdraw() external {
        require(msg.sender == owner, "You are not an owner");
        isWithdrawEnabled = true;
    }

    function buyToken(address _referrer) external payable {
        require(
            _referrer != address(this),
            "referrer must be original account"
        );
        if (convertAmountToUsd(address(this).balance) < price) {
            revert("Amount should be greater or equal to price");
        }

        users[msg.sender] = User({
            levelIncome: 0,
            referralIncome: 0,
            referrer: _referrer,
            tokensReceived: true
        });

        token.transfer(_referrer, levelsIncome);
        address ref = _referrer;
        for (uint256 i = 0; i < 9; i++) {
            ref = users[ref].referrer;
            users[ref].levelIncome =
                users[_referrer].levelIncome +
                levelsIncome;
        }

        token.transfer(msg.sender, tokenToBeSent);

        if (convertAmountToUsd(address(this).balance) - price > 0) {
            payable(msg.sender).transfer(
                convertAmountToUsd(address(this).balance) - price
            );
        }
    }

    function convertAmountToUsd(uint256 amount) public view returns (uint256) {
        return
            (amount * IPriceFeed(priceFeed).latestAnswer()) /
            IPriceFeed(priceFeed).decimals();
    }

    function withdrawLevelIncome() external {
        require(
            token.balanceOf(address(this)) >= users[msg.sender].levelIncome,
            "Contract don't have sufficient tokens"
        );
        require(isWithdrawEnabled, "Withdrawing token is not allowed by owner");
        if (users[msg.sender].levelIncome > 0) {
            token.transfer(msg.sender, users[msg.sender].levelIncome);
            users[msg.sender].levelIncome = 0;
        }
    }

    receive() external payable {
        revert("Direct BNB transfer not allowed");
    }

    function withdrawDumpedtokens(IERC20 _token) external {
        require(msg.sender == owner, "You are not an owner");
        require(
            _token.balanceOf(address(this)) > 0,
            "No token balance available"
        );
        _token.transfer(msg.sender, _token.balanceOf(address(this)));
    }
    // function buyToken(address referrer, uint256 amount) external{
    //     require()
    // }
}

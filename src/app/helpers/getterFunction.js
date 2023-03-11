import Web3 from "web3";

export const getBalance = async (account) => {
    let web3 = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545");
    let bal = (await web3.eth.getBalance(account)/1e18).toFixed(3);

  
    return bal;
  };
  
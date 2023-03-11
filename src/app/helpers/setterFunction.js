import { ethers } from "ethers";
import { TokenBEP20, tokenSale } from "../config/contracts";
import tokenSaleABI from "../config/tokenSale.json"
import tokenBep20Abi from "../config/tokenBEP.json"

export const exportInstance = async (SCAddress, ABI) => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let a = new ethers.Contract(SCAddress, ABI, signer);

  if (a) {
    return a;
  } else {
    return {};
  }
};

export const tokenSaleContract = async () => {
  let contract = await exportInstance(tokenSale, tokenSaleABI);
  console.log("token sale contract is------>", contract);
  return contract
}

export const userIncome = async (address) => {
  let contract = await tokenSaleContract();
  console.log("contract is---->", contract);
  let data = await contract.users(address);
  console.log("userIncome data is", data)
  let isWithdrawEnabled = await contract.isWithdrawEnabled()
  let token = await exportInstance(TokenBEP20, tokenBep20Abi)
  let tokenBal = await token.balanceOf(address)

  return { data: data, tokenBalance: tokenBal, isWithdrawEnabled: isWithdrawEnabled }
};


export const handleBuyToken = async (account, ref) => {
  let contract = await tokenSaleContract();
  console.log("contract is---->", contract);
  let amount = (await contract.getAmountToBePaid()).toString()
  let data = await contract.buyToken(ref, { from: account, value: amount, gasLimit: 1000000 });
  console.log("userIncome data is", data)
  return data;
}

export const withdrawLevelIncome = async (account) => {
  let contract = await tokenSaleContract();
  let data = await contract.withdrawLevelIncome({ from: account, gasLimit: 1000000 });

  return data;
}
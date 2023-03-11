import { ethers } from "ethers";
import { TokenBEP20, tokenSale } from "../config/contracts";
import tokenSaleABI from "../config/tokenSale.json"
import tokenBep20Abi from "../config/tokenBEP.json"
import toast from "react-hot-toast";
import BigNumber from "bignumber.js"

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
  try {
    let contract = await tokenSaleContract();
    console.log("contract is---->", contract);
    let amount = (await contract.getAmountToBePaid()).toString()
    let es
    try {
      es = await contract.estimateGas.buyToken(
        ref, { from: account, value: amount }
      )

    }
    catch (err) {
      console.log("errrr", err)
      toast.error("Error while buying.." + err.data?.message)
      console.log("error", err.code)
      return false
    }
    let priceLimit = new BigNumber(es.toString()).plus(new BigNumber(es.toString()).multipliedBy(0.1))
    let data = await contract.buyToken(ref, { from: account, value: amount, gasLimit: Math.ceil(parseFloat(priceLimit.toString())) });
    console.log("userIncome data is", data)
    data = await data.wait()
    if (data.status)
      toast.success("Successfully purchased")
    else
      toast.error("Error while buying..")
    return data;
  }
  catch (err) {
    toast.error("Error while buying..", err.message)
    console.log("error", err.code)
    return false
  }
}

export const withdrawLevelIncome = async (account) => {
  try {
    let es;
    let contract = await tokenSaleContract();
    try {
      es = await contract.estimateGas.withdrawLevelIncome()
    }
    catch (err) {
      console.log("errrr", err)
      toast.error("Error while buying.." + err.data?.message)
      console.log("error", err.code)
      return false
    }
    let priceLimit = new BigNumber(es.toString()).plus(new BigNumber(es.toString()).multipliedBy(0.1))


    let data = await contract.withdrawLevelIncome({ from: account, gasLimit: Math.ceil(parseFloat(priceLimit.toString())) });
    data = await data.wait()
    if (data.status)
      toast.success("Successfully purchased")
    else
      toast.error("Error while buying..")
    return data
  }
  catch (err) {
    toast.error("Error while buying..")
    console.log("error")
    return false
  }
}
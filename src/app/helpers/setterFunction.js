import { ethers } from "ethers";
import { tokenSale } from "../config/contracts";
import tokenSaleABI from "../config/tokenSale.json"

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

  export const tokenSaleContract=async()=>{
    let contract=await exportInstance(tokenSale,tokenSaleABI);
    console.log("token sale contract is------>",contract);
    return contract
  }

  export const userIncome=async(address)=>{
    let contract=await tokenSaleContract();
console.log("contract is---->",contract);
    let data=await contract.users(address);
    console.log("userIncome data is",data)
    return data;

  }
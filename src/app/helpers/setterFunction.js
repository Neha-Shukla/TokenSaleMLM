import { ethers } from "ethers";
import { TokenBEP20, tokenSale } from "../config/contracts";
import tokenSaleABI from "../config/tokenSale.json"
import tokenBep20Abi from "../config/tokenBEP.json"
const targetNetworkId = '0x61';

export const exportInstance = async (SCAddress, ABI) => {
  let provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s3.binance.org:8545");
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
    let network=checkNetwork();
    if(network==false){
        await switchNetwork();
    }
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
    let network=checkNetwork();
    if(network==false){
        await switchNetwork();
    }
  let contract = await tokenSaleContract();
  console.log("contract is---->", contract);
  let amount = (await contract.getAmountToBePaid()).toString()
  let data = await contract.buyToken(ref, { from: account, value: amount, gasLimit: 1000000 });
  console.log("userIncome data is", data)
  return data;
}

export const withdrawLevelIncome = async (account) => {
    let network=checkNetwork();
    if(network==false){
        await switchNetwork();
    }
  let contract = await tokenSaleContract();
  let data = await contract.withdrawLevelIncome({ from: account, gasLimit: 1000000 });

  return data;
}

export const checkNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
  
      // return true if network id is the same
      console.log("current chain id is",currentChainId,process.env.ChainID);
      if (currentChainId ==targetNetworkId) return true;
      // return false is network id is different
      return false;
    }
  };

 export const switchNetwork = async () => {
    
    
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetworkId }],
          });
          // refresh
          window.location.reload();
    
    
  };
import Web3 from "web3";

export const getBalance = async (account) => {
    let web3 = new Web3(Web3.givenProvider);
    let bal = (await web3.eth.getBalance(account)/1e18).toFixed(3);

  
    return bal;
  };
  
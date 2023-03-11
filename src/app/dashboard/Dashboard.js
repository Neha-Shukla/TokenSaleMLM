import React, { useState, useEffect } from 'react';
// import { TodoListComponent } from '../apps/TodoList'
import { handleBuyToken, handleCopyToClipboard, tokenSaleContract, userIncome } from '../helpers/setterFunction';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { CHAIN_ID, DEFAULT_REF } from '../helpers/constants';
import { ethers } from "ethers";
import { checkNetwork, switchNetwork } from '../helpers/setterFunction';
import { withdrawLevelIncome } from '../helpers/setterFunction';
import { BallTriangle, InfinitySpin } from 'react-loader-spinner'
import moment from "moment"
import Clock from './clock';
import { getCurrentProvider, getProvider } from '../connectWallet';
import eventEmitter from '../events/events';
import { toast } from 'react-hot-toast';
const targetNetworkId = '0x61';
function Dashboard() {
  const [account, setAccount] = useState();
  const [income, setIncome] = useState({})
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)
  const [functionCallLoad, setFunctionCallLoad] = useState(false)
  const [refAddress, setRefAddress] = useState()
  console.log("refAddress", refAddress)

  useEffect(() => {
    const fetch = async () => {
      let provider = await getProvider()

      console.log("proo", provider)

      if (provider) {
        provider.on("accountsChanged", (accounts) => {
          console.log(accounts);
          Cookies.set("account", accounts[0], {
            expires: 7,
          });
          eventEmitter.emit("ReloadAccount")
          setReload(!reload)
        });

        // Subscribe to chainId change
        provider.on("chainChanged", async (chainId) => {
          console.log(chainId);
          if (chainId != CHAIN_ID) {
            console.log("herrr")

            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetNetworkId }],
            });
          }
          setReload(!reload)
        });
      }

    }
    fetch()
  })

  useEffect(() => {
    async function getContract() {
      setLoading(true)
      try {
        let acc = Cookies.get("account")
        if (acc) {
          setAccount(acc);

          let _income = await userIncome(acc);
          console.log("user income is", _income);
          setIncome(_income)
        }
        await tokenSaleContract();
        setLoading(false)
      }
      catch (err) {
        console.log("err", err)
        setLoading(false)
      }

    }
    getContract();
  }, [reload, Cookies.get("account")])



  return (
    < div >

      {console.log("income", income)}

      {loading ?
        <div className='d-flex loader'>
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          /></div> : ""}

      {functionCallLoad ? <InfinitySpin
        width='200'
        color="#4fa94d"
      /> : ""}

      <div div className="row" >

        <div className="col-sm-4 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Level Income</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h2 className="mb-0">{income?.data?.levelIncome ? ethers.utils.formatEther(income?.data?.levelIncome?.toString()).toString() : 0}</h2>

                  </div>
                </div>
                {console.log("Number(income?.data?.nextWithdrawnTime) < new Date().valueOf()", Number(income?.data?.nextWithdrawnTime), new Date().valueOf())}
                <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                  <button className="btn btn-outline-light btn-rounded get-started-btn withdraw-btn"
                    disabled={!income?.isWithdrawEnabled
                      || Number(ethers.utils.formatEther(income?.data?.levelIncome?.toString()).toString()) <= 0
                      || Number(income?.data?.nextWithdrawnTime * 1000 > new Date().valueOf())
                    } onClick={async () => {
                      setFunctionCallLoad(true)
                      await withdrawLevelIncome(account)
                      setFunctionCallLoad(false)
                      setReload(!reload)
                    }}>Withdraw</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {Number(income?.data?.levelIncome) > 0 &&
          <div className="col-sm-4 grid-margin ">
            <div className="card">
              <div className="card-body">
                <h5>Next Withdraw In</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">

                      <>

                        <Clock deadline={moment.utc((Number(income?.data?.nextWithdrawnTime)) * 1000).local().format()}></Clock></>

                    </div>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-wallet-travel text-danger ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="col-sm-4 grid-margin ">
          <div className="card">
            <div className="card-body">
              <h5>Referral Income</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h2 className="mb-0">{income?.data?.referralIncome ? ethers.utils.formatEther(income?.data?.referralIncome?.toString()).toString() : 0}</h2>
                  </div>
                </div>
                <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                  <i className="icon-lg mdi mdi-wallet-travel text-danger ml-auto"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-4 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token Balance</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h2 className="mb-0">{income?.tokenBalance?.toString() ? ethers.utils.formatEther(income?.tokenBalance?.toString()).toString() : 0}</h2>
                  </div>
                </div>
                <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                  <i className="icon-lg mdi mdi-monitor text-success ml-auto"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {income?.data?.tokensReceived &&
          <div className="col-sm-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Referrer</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h7 className="mb-0">{income?.data?.referrer ? income?.data?.referrer : ""}</h7>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        } */}
      </div >

      <div className="row">
        <div className="col-md-6 col-xl-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">REFERRAL LINK</h4>
              <div onClick={() => {
                handleCopyToClipboard(`https://lucreway.com/refAdd/${account}`)
              }}>
                <input type="text" className='refferalLink' disabled={true} value={account ? `https://lucreway.com/${account}` : ""}></input>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-6 grid-margin stretch-card">
          <div className="card">

            <div className="card-body buy-token">
              <label for="refAddress">Referred By</label>
              <input id="refAddress" type="text" disabled={!account} value={refAddress} onChange={(e) => { setRefAddress(e.target.value) }}></input>
              <button className="btn btn-outline-light btn-rounded get-started-btn buytoken-btn" disabled={income?.data?.tokensReceived || !account} onClick={() => {

                if (refAddress?.toLowerCase() === account?.toLowerCase()) {
                  toast.error("You can't be your own referrer");
                  return
                }
                if (!ethers.utils.isAddress(refAddress)) {
                  toast.error("Valid Referrer Address Required");
                  return
                }
                setFunctionCallLoad(true)

                handleBuyToken(account, ethers.utils.isAddress(refAddress) ? refAddress : DEFAULT_REF)
                setReload(!reload)
              }}>
                {income?.data?.tokensReceived ? "Already Purchased!!" : "Buy Token (5000)"}</button>
              <br></br>
              <h6 className="preview-subject">Tokens can be purchase only once by one wallet</h6>

            </div>
          </div>
        </div>
      </div>

    </div >
  );
}


export default Dashboard;
import React, { useState, useEffect } from 'react';
// import { TodoListComponent } from '../apps/TodoList'
import { handleBuyToken, tokenSaleContract, userIncome } from '../helpers/setterFunction';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { DEFAULT_REF } from '../helpers/constants';
import { ethers } from "ethers";
import { checkNetwork, switchNetwork } from '../helpers/setterFunction';
import { withdrawLevelIncome } from '../helpers/setterFunction';
import { BallTriangle, InfinitySpin } from 'react-loader-spinner'
import moment from "moment"
import Clock from './clock';

function Dashboard() {
  const [account, setAccount] = useState();
  const [income, setIncome] = useState({})
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)
  const [functionCallLoad, setFunctionCallLoad] = useState(false)
  const { refAddress } = useParams()
  console.log("refAddress", refAddress)



  useEffect(() => {
    async function getContract() {
      setLoading(true)
      try {
        let acc = Cookies.get("account")
        if (acc) {
          setAccount(acc);
          let network = await checkNetwork();
          console.log("network chain is", network);
          if (network == false) {
            alert("Please switch newtork to BNB");
            await switchNetwork();

            // return;
          }
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

                    {Number(income?.data?.levelIncome) > 0 &&
                      <>
                        <br></br>
                        <h5>Next Withdraw In</h5>
                        <Clock deadline={moment.utc((Number(income?.data?.nextWithdrawnTime)) * 1000).local().format()}></Clock></>}
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
        {income?.data?.tokensReceived &&
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
        }
      </div >

      <div className="row">
        <div className="col-md-12 col-xl-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">REFERRAL LINK</h4>
              <input type="text" className='refferalLink' disabled={true} value={account ? `http://localhost:3000/refAdd/${account}` : ""}></input>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 col-xl-12 grid-margin stretch-card">
          <div className="card">

            <div className="card-body buy-token">
              <label for="refAddress">Referred By</label>
              <input id="refAddress" type="text" disabled={true} value={ethers.utils.isAddress(refAddress) ? refAddress : (DEFAULT_REF + " (default)")}></input>
              <button className="btn btn-outline-light btn-rounded get-started-btn buytoken-btn" disabled={income?.data?.tokensReceived} onClick={() => {
                handleBuyToken(account, ethers.utils.isAddress(refAddress) ? refAddress : DEFAULT_REF)
                setReload(!reload)
              }}>{income?.data?.tokensReceived ? "Already Purchased!!" : "Buy Token (5000)"}</button>
              <h6 className="preview-subject">Tokens can be purchase only once by one wallet</h6>

            </div>
          </div>
        </div>

      </div>

    </div >
  );
}


export default Dashboard;
import React, { Component,useState,useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { connectWithMetamask } from '../helpers/setterFunction';
import Modal from '../connectWallet/Modal/Modal';
import Cookies from 'js-cookie';

function Navbar () {
 
  const [showModal,setShowModal]=useState(false);
  const [account,setAccount]=useState();
  useEffect(()=>{
            let acc=Cookies.get("account")
            if(acc){
              setAccount(acc);
            }
            console.log("account is ----->",acc);
  },[Cookies.get("account")])
    return (
      <nav className="navbar p-0 fixed-top d-flex flex-row">
      {showModal?<Modal></Modal>:""}
      
        <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo-mini" to="/"><img src={require('../../assets/images/logo-mini.svg')} alt="logo" /></Link>
        </div>
        <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button className="navbar-toggler align-self-center" type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
            <span className="mdi mdi-menu"></span>
          </button>
          <ul className="navbar-nav w-100">
            <li className="nav-item w-100">
              <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search">
                <input type="text" className="form-control" placeholder="Search products" />
              </form>
            </li>
          </ul>
          <ul className="navbar-nav navbar-nav-right">
           
           
           
          
            <Dropdown alignRight as="li" className="nav-item">
              <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
              {account?
              (<>
                <div className="navbar-profile">
                  <img className="img-xs rounded-circle" src={require('../../assets/images/faces/face15.jpg')} alt="profile" />
                  <button type="button" onClick={() => {
                  //  setShowModal(true)
                  }}>{account}</button>
                  <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                </div>
              </>):(<><div className="navbar-profile">
                  
                  <button type="button" onClick={() => {
                   setShowModal(true)
                  }}>Connect Wallet</button>
                  <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                </div></>)}
              
              </Dropdown.Toggle>


            </Dropdown>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={() => {
            console.log("clicked on this")
          }}>
            <span className="mdi mdi-format-line-spacing"></span>
          </button>
        </div>
      </nav>
    );
  }


export default Navbar;

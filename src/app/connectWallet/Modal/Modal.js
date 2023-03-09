import React, { useEffect, useRef, useCallback,useState } from "react";
import useStyles from "./ModalStyles";
import metamaskImage from "./../assets/metamask.png"
import walletConnectImage from "./../assets/walletConnect.png"
import { connectWithMetamask, walletConnect } from "..";

const Modal = () => {
    const classes = useStyles();
    const modal = useRef(null);

    // const handleKeyUp = useCallback(
    //     e => {
    //         const keys = {
    //             27: () => {
    //                 e.preventDefault();
    //                 // onCloseRequest();
    //                 window.removeEventListener("keyup", handleKeyUp, false);
    //             }
    //         };

    //         if (keys[e.keyCode]) {
    //             keys[e.keyCode]();
    //         }
    //     },
    //     []
    // );

    // const handleOutsideClick = useCallback(
    //     e => {
    //         if (!isNil(modal)) {
    //             if (!modal?.current?.contains(e.target)) {
    //                 onCloseRequest();
    //                 document.removeEventListener("click", handleOutsideClick, false);
    //             }
    //         }
    //     },
    //     [onCloseRequest]
    // );

    // useEffect(() => {
    //     window.addEventListener("keyup", handleKeyUp, false);
    //     document.addEventListener("click", handleOutsideClick, false);

    //     return () => {
    //         window.removeEventListener("keyup", handleKeyUp, false);
    //         document.removeEventListener("click", handleOutsideClick, false);
    //     };
    // }, [handleKeyUp]);

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modal} ref={modal}>

                <div className={classes.walletContainer}>
                    <h3 className={classes.walletMainHeading}>Connect Wallet</h3>
                    <div className={classes.walletHeading}>
                        Start by connecting with one of the wallets below. Be sure to store your private keys or seed phrase securely. Never share them with anyone.</div>
                    <div className="row justify-content-evenly">
                        <div className={`col-md-6 ${classes.imgContainer} ${classes.metamask} `} onClick={async () => {
                            await connectWithMetamask()
                        }}>
                            <img className={classes.walletIcon} src={metamaskImage} />
                        </div>
                        <div className={`col-md-6 ${classes.imgContainer} ${classes.walletConnect}`} onClick={async () => {
                            await walletConnect()
                        }}>
                            <img className={classes.walletIcon} src={walletConnectImage} />
                        </div>

                    </div>

                </div>

            </div>
        </div >
    );
};


export default Modal;

export const connectWithMetamask = async () => {
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(async (res) => {
                console.log(res[0], window.ethereum.networkVersion)
                // let resp = await checkIfOwnerExist({ walletAddress: res[0] })
                // if (resp === false) {
                //     toast.error(messages.notAnOwner)
                //     localStorage.clear()
                //     // await Logout(true)
                // }
                // else if (resp === true) {
                //     localStorage.setItem(account, res[0])
                //     localStorage.setItem(connectedrole, "owner")
                //     localStorage.setItem(chainId, window.ethereum.networkVersion)
                //     localStorage.setItem("decrypt_redeem_connectedWallet", "metamask")
                //     console.log("Provider meta", window?.ethereum)
                //     window.location.reload()
                // }
            })
    } else {
        alert("install metamask extension!!")
    }

}
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    // Prevent page scrolling when modal is open
    "@global": {
        body: {
            overflow: "hidden"
        }
    },

    // Modal wrapper
    modalOverlay: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        padding: "1rem",
        // backgroundColor: "rgba(0, 0, 0, 0.7)",
        // zIndex: "9999",
        opacity: 1,
        animation: "$show .5s ease",
        overflowX: "hidden",
        overflowY: "auto"
    },

    // Fade in open animation
    "@keyframes show": {
        "0%": {
            display: "none",
            opacity: 0
        },
        "1%": {
            display: "flex",
            opacity: 0
        },
        "100%": {
            opacity: 1
        }
    },

    // Modal itself
    modal: {
        width: "100%",
        backgroundColor: "#fff",
        boxShadow: [0, 0, "0.625rem", "rgba(0, 0, 0, 0.2)"],
        position: "relative",
        padding: "2rem",

        "@media (min-width: 576px)": {
            width: "32rem"
        },
        borderRadius: "20px",
        "& p:last-of-type": {
            marginBottom: 0
        }
    },


    imgContainer: {
        height: "93px",
        width: "93px",
        borderRadius: "10px",

    },

    metamask: {
        background: "linear-gradient(45deg, #905a36, transparent)",
        border: "1px solid #f18c3c",
        '&:hover': {
            border: "2px solid #f18c3c"
        }
    },
    walletConnect: {
        background: "linear-gradient(45deg, #0081f469, transparent)",
        border: "1px solid #0078f6",
        '&:hover': {
            border: "2px solid #0078f6"
        }
    },

    walletIcon: {
        height: "100%",
        width: "100%",
        objectFit: "contain",
        cursor: "pointer"
    },

    walletHeading: {
        fontFamily: "serif",
        fontSize: "initial",
        paddingBottom: "20px"
    },

    walletMainHeading: {
        textAlign: "center",
        paddingBottom: "11px",
        textDecoration: "underline"
    }
});

export default useStyles;

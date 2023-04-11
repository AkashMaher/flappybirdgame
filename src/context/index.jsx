import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { useContext } from "react";
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState();

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", accountsChanged);
            window.ethereum.on("chainChanged", chainChanged);
        }
    }, []);
    // 



    // 

    const connectHandler = async () => {
        if (window.ethereum) {
            try {
                const res = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                await accountsChanged(ethers.getAddress(res[0]));
            } catch (err) {
                console.error(err);
                setErrorMessage("There was a problem connecting to MetaMask");
            }
        } else {
            setErrorMessage("Install MetaMask");
        }
    };

    const accountsChanged = async (newAccount) => {
        setAccount(newAccount);
        localStorage.setItem('account', newAccount)
        try {
            const balance = await window.ethereum.request({
                method: "eth_getBalance",
                params: [newAccount.toString(), "latest"],
            });
            console.log(balance);
            console.log(ethers);
            let bal = ethers.formatEther(balance)
            // console.log(bal)
            setBalance(parseFloat(bal).toFixed(3));
        } catch (err) {
            console.error(err);
            setErrorMessage("There was a problem connecting to MetaMask");
        }
    };

    const handleImageClick = (AssetSelected) => {
        setSelectedAsset(AssetSelected);
    }
    const handleDisconnect = () => {
        setAccount(null);
        setBalance(null);
    }
    const chainChanged = () => {
        setErrorMessage(null);
        setAccount(null);
        setBalance(null);
    };

    return (
        <GlobalContext.Provider value={{
            account,
            errorMessage,
            balance,
            handleImageClick,
            handleDisconnect,
            connectHandler,
            selectedAsset
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);

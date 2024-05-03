// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [networkProvider, setNetworkProvider] = useState(null);
    const [currentAccount, setCurrentAccount] = useState(null);

    useEffect(() => {
        async function loadProvider() {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const account = accounts[0];
                setNetworkProvider(provider);
                setCurrentAccount(account);
            } else {
                console.log("Ethereum object not found, install MetaMask.");
                alert("Please install MetaMask!");
            }
        }

        loadProvider();
    }, []);

    return (
        <AppContext.Provider value={{ networkProvider, currentAccount }}>
            {children}
        </AppContext.Provider>
    );
};

import React, { useState, useEffect } from 'react'
import './App.css';

import { ethers } from "ethers";
import Web3 from "web3";
import TokenArtifact from '../contract/fasatoken_abi.json';
import ConnectWallet from './component/connectBtn';
import contractAddress from '../contract/contract_address.json';
declare let window: any;
const HARDHAT_NETWORK_ID = '31337';

function App() {
  const [connectionStatus, setConnected] = useState(false);
  const [address, setAddress] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);
  const [token, setToken] = useState(undefined)
  const [error, setError] = useState(undefined)


  async function __connect() {
    if (window.ethereum) {
      try {
        console.log("KI")
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts);
        console.log(accounts)
      } catch (error:any) {
        if (error.code === 4001) {
          // User rejected request
        }
        setError(error);
      }
    }
    const token: any = await new ethers.Contract(contractAddress.Token, TokenArtifact.abi, new ethers.providers.Web3Provider(window.ethereum));
    setToken(token);

    window.ethereum.on("accountsChanged", ([newAddress]:any) => {
      console.log("account changed", newAddress)
      if (newAddress === undefined) {
        return __resetState()
      }
      __initialzie()
    })
  }

  async function __getTokenData() {
    console.log(typeof (token))
    // if (token !== undefined) {
    //   const name = await token.name();
    //   const symbol = await token.symbol();
    //   console.log(name)
    //   console.log(symbol)
    // }
  }

  function __initialzie() {
    __getTokenData()
  }

  function __resetState() {
    setConnected(false)
    setAddress(undefined)
    setNetworkError(undefined)
    setToken(undefined)
  }

  


  return (
    <div className="App">
      {!connectionStatus &&
        <ConnectWallet
          connectWallet={() => __connect()}
          networkError={networkError}
          dismiss={() => setNetworkError(undefined)} />}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import "./App.css";

import { ethers } from "ethers";
import Web3 from "web3";
import TokenArtifact from "../contract/fasatoken_abi.json";
import ConnectWallet from "./component/connectBtn";
import contractAddress from "../contract/contract_address.json";
import { Loading } from "./component/loading";
import { Transfer } from "./component/transfer";
declare let window: any;
const HARDHAT_NETWORK_ID = "31337";

function App() {
  const [connectionStatus, setConnected] = useState(false);
  const [address, setAddress] = useState(undefined);
  const [networkError, setNetworkError] = useState<any>(undefined);
  const [token, setToken] = useState(Object);
  const [txBeginSent, setBeginSend] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [balance, setBalance] = useState<any>(undefined);
  const [tokenName, setTokenName] = useState(undefined);
  const [tokenSymbol, setTokenSymbol] = useState(undefined);

  async function __connect() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      } catch (error: any) {
        if (error.code === 4001) {
          console.log("User Reject connect");
        }
        setError(error);
      }
    }
  }

  async function __getTokenData() {
    const token: any = await new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      new ethers.providers.Web3Provider(window.ethereum)
    );
    setToken(token);
    setTokenName(await token.name());
    setTokenSymbol(await token.symbol());
  }

  async function __updateBalance() {
    if (address != undefined) {
      console.log("address", address);
      const balance = await token.balanceOf(address);
      setBalance(balance);
      console.log("Current Token", balance.toString());
    }
  }

  /**
   * init event handler : accountChange, networkChange
   *  *_* even account only change, token reset automatically. so should init token again.
   */
  async function __initialzie() {
    window.ethereum.on("accountsChanged", ([newAddress]: any) => {
      console.log("account changed", newAddress);
      setAddress(newAddress);
      if (newAddress === undefined) {
        __resetState();
      } else if (__checkNetwork()) {
        refreshToken();
      }
    });
    window.ethereum.on("networkChanged", ([networkId]: any) => {
      console.log("Check network");
      if (__checkNetwork()) {
        refreshToken();
      } else {
        __resetState();
      }
    });
  }

  function __resetState() {
    setConnected(false);
    setAddress(undefined);
    setNetworkError(undefined);
    setToken(undefined);
  }

  function __checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }
    setNetworkError("Please connect Metamask to FasaNetwork:8545");
    return false;
  }

  async function refreshToken() {
    await __getTokenData();
  }

  async function __transferTokens(to: any, amount: any) {
    try {
      const tx = await token.transfer(to, amount);
      setBeginSend(tx.hash);
      const receipt = await tx.await();
      if (receipt.status === 0) {
        throw new Error("Transaction Failed");
      }
      await __updateBalance();
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    console.log("KILL");
    __updateBalance();
  }, [address]);

  useEffect(() => {
    __initialzie();
    __getTokenData();
  }, []);

  return (
    <div className="App">
      {!address && (
        <ConnectWallet
          connectWallet={() => __connect()}
          networkError={networkError}
          dismiss={() => setNetworkError(undefined)}
        />
      )}
      {/* {(!token || !balance) && <Loading />} */}
      {balance && balance > 0 && (
        <Transfer
          transferTokens={(to: any, amount: any) =>
            __transferTokens(to, amount)
          }
          tokenSymbol={tokenSymbol}
        />
      )}
    </div>
  );
}

export default App;

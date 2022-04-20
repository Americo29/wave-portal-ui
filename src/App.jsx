//libraries
import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import LoadingOverlay from 'react-loading-overlay'
import moment from 'moment'
//styles
import './App.css';
//json
import abi from './utils/WavePortal.json'
//components
import Card from './Components/Card/Card'
import Loading from './Components/Loading/Loading'

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [waves, setWaves] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isGetWaves, setGetWaves] = useState(false);
  const [text, setText] = useState("");

  const textAreaRef = useRef();

  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x380b1EC8739cff31662c9526F1FD9a28b21D366f";
  const contractABI = abi.abi;


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        if(!isGetWaves){
          getAllWaves();
          setGetWaves(true);
        }
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message 
          };
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");        
      }
    } catch(error){
      console.log(error);
    }
  }

  // useEffect(()=>{
  //   let wavePortalContract;

  //   const onNewWave = (from, timestamp, message) =>{
  //     console.log("NewWave", from, timestamp, message);
  //     setAllWaves(prevState => [
  //       ...prevState,
  //       {
  //         address: from,
  //         timestamp: new Date(timestamp * 1000),
  //         message,
  //       },
  //     ]);
  //   };

  //   if(window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();

  //     wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  //     wavePortalContract.on("NewWave", oneNewWave);
  //   }

  //   return () => {
  //     if(wavePortalContract) {
  //       wavePortalContract.off("NewWave", onNewWave);
  //     }
  //   };  
  // },[]);

  const wave = async () => {
    try {
      setText("");
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(text, {gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        setLoading(true);

        await waveTxn.wait();

        console.log("Mined -- ", waveTxn.hash);

        setLoading(false);
        setGetWaves(false);

        count = await wavePortalContract.getTotalWaves();
        setWaves(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());
        getAllWaves();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  },[])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <Card>
          <div className="header">
            👋 Hey it's a pleassure!
          </div>
          I have {waves} waves {'\u2728'}
          <div className="bio">
            Hi, I'm Acon and it's wonderful to greet you! 
          </div>
          <div className="bio">
           Could you send a message! 
          </div>
          <textarea
            ref={textAreaRef}
            value={text}
            style={{ flex: 1, border: "1px solid grey", Height: "50px", Width: "200px"  }}
            onChange={e => setText(e.target.value)}
          />

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
          </button>
          )}
          <button className="waveButton" onClick={wave}>
            wave at Me
          </button>
        </Card>

        {isLoading && (
          <Loading />
        )}

        <div class="grid">
                  {allWaves.map((wave, index) => {
          return (
           
            <div key={index} style={{ minWidth: "auto", backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "grey",                  
                }}
                >Message:</div>
              <div
                style={{            
                    fontSize: "14px",
                  paddingTop: "10px"
                }}
                >{wave.message}</div>
              <div
                style={{
                  fontSize: "12px",
                  color: "grey",
                  paddingTop: "10px"
                }}
                >From: {wave.address}</div>
              <div
                style={{
                  fontSize: "12px",
                   color: "grey"
                }}
                >
                {moment(wave.timestamp.toString()).format('dddd, MMM Do, YYYY')}</div>
            </div>
          )
        })}
        </div>



      </div>
    </div>
  );
}

import './App.css';
import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import wizardsGame from './utils/WizardsGame.json';
import LoadingIndicator from './Components/LoadingIndicator';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';



// Constants
const TWITTER_HANDLE = 'iangeier';
const TWITTER_HANDLE_BS = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TWITTER_LINK_BS = `https://twitter.com/${TWITTER_HANDLE_BS}`;

const App = () => {
const [currentAccount, setCurrentAccount] = useState(null);
const [characterNFT, setCharacterNFT] = useState(null);
const [isLoading, setIsLoading] = useState(false);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
    
    setIsLoading(false);
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFTMetadata = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const _gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      wizardsGame.abi,
      signer
    );

    const txn = await _gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log('No character NFT found');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);


  const renderUnconnectedWallet = ()=>{
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if(!currentAccount){
      return (
        <div>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F4.bp.blogspot.com%2F-EPRi_Ew5eus%2FVVUyIzRCbSI%2FAAAAAAAAECM%2FtKBfQC6TA0E%2Fs1600%2Fharry%252Bp.gif&f=1&nofb=1"
            alt="Harry Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
      </div>
      )
    }else if(currentAccount && !characterNFT){
      return (<SelectCharacter setCharacterNFT={setCharacterNFT}/>);
    }else if (currentAccount && characterNFT) {
      return (<Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>);
    }else return;
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">✨ Wizard Battle ✨</p>
          <p className="sub-text">WizardUp and fight voldy!</p>
          <div className="connect-wallet-container">
            {renderUnconnectedWallet()}
          </div>
        </div>
      </div>
        <div className="footer-container">
        Built with ❤ by 
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          > Novvan </a>.
          Thanks to <a className="footer-text"
            href={TWITTER_LINK_BS}
            target="_blank"
            rel="noreferrer">@{TWITTER_HANDLE_BS}</a>
        </div>
      </div>
  );
};

export default App;

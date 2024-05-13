import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt4, HiHome } from "react-icons/hi";
import { AiOutlineClose, AiOutlineGlobal } from "react-icons/ai";
import { FaRegHandshake, FaUniversity } from "react-icons/fa";
import { shortenAddress } from "../utils/ShortAdress";
import { AppContext } from "../context/AppContext";

// Define chain information for switching
const networks = {
  Atlas: {
    chainId: '0x1b9e', // Planq Mainnet
    chainName: 'Planq',
    rpcUrls: ['https://planq-rpc.nodies.app'],
  },
  Scroll: {
    chainId: '0x8274f', // Scroll Testnet
    chainName: 'Scroll Testnet',
    rpcUrls: ['https://scroll-sepolia.drpc.org'],
  },
  TestBSC: {
    chainId: '0x61', // BNB Testnet
    chainName: 'BNB Testnet',
    rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
  }
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { currentAccount, connectWallet } = useContext(AppContext);

  const switchNetwork = async (networkName) => {
    const network = networks[networkName];

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: network.chainId,
                chainName: network.chainName,
                rpcUrls: network.rpcUrls
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add the network:', addError);
        }
      }
    }
  };

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
    <div className="md:flex-[0.8] flex-initial justify-center items-center">
      <div className="text-white md:flex list-none flex-row justify-between items-center flex-initial">
        <div className="menu-transition ">
          <Link to="/">
            <text> Welcome To Oracle DAO </text>
          </Link>
        </div>
      </div>
    </div>
      <div className="md:flex hidden list-none flex-row justify-between items-center flex-initial">
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        <li className="menu-transition mx-4 cursor-pointer border-b-2 border-transparent hover:border-blue-600">
          <Link to="/">HomePage</Link>
        </li>
        <li className="menu-transition mx-4 cursor-pointer border-b-2 border-transparent hover:border-blue-600">
          <Link to="/DAO">DAO</Link>
        </li>
        <li className="menu-transition mx-4 cursor-pointer border-b-2 border-transparent hover:border-blue-600">
          <Link to="/Governance">Governance</Link>
        </li>
        <select onChange={(e) => switchNetwork(e.target.value)} className="bg-[#2952e3] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#2546bd]">
          <option value="Atlas">Planq</option>
          <option value="scroll">Scroll Sepolia</option>
          <option value="testBSC">Testnet BSC</option>
        </select>
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-lg cursor-pointer hover:bg-[#2546bd]">
          <button onClick={connectWallet}>
            {!currentAccount
              ? "Connect Wallet"
              : shortenAddress(currentAccount)}
          </button>
        </li>
      </ul>
      </div>
      <div className="md:hidden flex justify-end items-center">
        {!toggleMenu ? (
          <HiMenuAlt4 fontSize={28} className="text-white cursor-pointer" onClick={() => setToggleMenu(true)} />
        ) : (
          <AiOutlineClose fontSize={28} className="text-white cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
      </div>
      {toggleMenu && (
        <ul className="z-10 fixed top-0 left-0 p-3 w-full h-screen bg-gray-900 md:hidden list-none
               flex flex-col justify-between text-white animate-slide-in">
          <div>
          <li className="text-xl w-full my-2"><AiOutlineClose className="text-xl cursor-pointer" onClick={() => setToggleMenu(false)}/></li>
            <li><Link to="/" className="flex items-center" onClick={() => setToggleMenu(false)}><HiHome className="mr-2"/>HomePage</Link></li>
            <li><Link to="/DAO" className="flex items-center" onClick={() => setToggleMenu(false)}><FaRegHandshake className="mr-2"/>DAO</Link></li>
            <li><Link to="/Governance" className="flex items-center" onClick={() => setToggleMenu(false)}><FaUniversity className="mr-2"/>Governance</Link></li>
          </div>
          <div className="w-full pb-4">
            <select onChange={(e) => { switchNetwork(e.target.value); setToggleMenu(false); }} className="w-full bg-[#2952e3] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#2546bd]">
              <option value="Atlas">Planq</option>
              <option value="Scroll">Scroll Sepolia</option>
              <option value="TestBSC">Testnet BSC</option>
            </select>
            <button onClick={() => { connectWallet(); setToggleMenu(false); }} className="bg-[#2952e3] text-white py-2 px-7 rounded-lg cursor-pointer hover:bg-[#2546bd] w-full mt-4">
              {currentAccount ? shortenAddress(currentAccount) : "Connect Wallet"}
            </button>
          </div>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

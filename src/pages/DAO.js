import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import OracleABI from '../utils/abis/Oralce_ABI.json';

const contractAddresses = {
    '61': '0x02f3A4bB77fF782A1F9ADeBF392D36390b10fd47',   // BSC Testnet
    '1ba5': '0xE62a3277429B9F26C466D31157D50CaE97561e7C', // Planq Testnet
    '8274f': '0x730de67Bf353F8d9B2648Cf0af9681b265f06b3A' // Scroll Testnet
  };
  
  const tickers = {
    '61': 'TBNB',     
    '1ba5': 'TPLANQ',
    '8274f': 'ETH',
  };
  
  const DAO = () => {
      const { currentAccount, networkProvider } = useContext(AppContext);
      const [daoContract, setDaoContract] = useState(null);
      const [chainId, setChainId] = useState('');
      const [stakedAmount, setStakedAmount] = useState('0');
      const [members, setMembers] = useState([]);
      const [additionalStake, setAdditionalStake] = useState('');
      const [withdrawAmount, setWithdrawAmount] = useState('');
      const [totalProposalFees, setTotalProposalFees] = useState('0');
      const [totalRequestFees, setTotalRequestFees] = useState('0');
      const [ticker, setTicker] = useState(''); // Initialize without default
  
      useEffect(() => {
          if (networkProvider) {
              networkProvider.getNetwork().then((network) => {
                  const hexChainId = network.chainId.toString(16);
                  setChainId(hexChainId);
                  setTicker(tickers[hexChainId] || 'Unknown'); // Set ticker or fallback to 'Unknown'
  
                  const contractAddress = contractAddresses[hexChainId];
                  if (contractAddress && currentAccount) {
                      const signer = networkProvider.getSigner();
                      const contract = new ethers.Contract(contractAddress, OracleABI, signer);
                      setDaoContract(contract);
                      fetchStakedAmount(contract, currentAccount);
                      fetchFees(contract);
                      fetchMembers(contract); 
                  }
              });
          }
      }, [networkProvider, currentAccount]);
  
      // Debugging chainId and ticker
      useEffect(() => {
          console.log('Chain ID:', chainId);
          console.log('Ticker:', ticker);
      }, [chainId, ticker]);
  
      const fetchStakedAmount = async (contract, account) => {
          try {
              const amount = await contract.stakes(account);
              setStakedAmount(ethers.utils.formatEther(amount));
          } catch (error) {
              console.error('Failed to fetch staked amount:', error);
          }
      };
  
      const fetchFees = async (contract) => {
          try {
              const proposalFees = await contract.totalProposalFeesCollected();
              const requestFees = await contract.totalRequestFeesCollected();
              setTotalProposalFees(ethers.utils.formatEther(proposalFees));
              setTotalRequestFees(ethers.utils.formatEther(requestFees));
          } catch (error) {
              console.error('Failed to fetch fees:', error);
          }
      };

      const fetchMembers = async (contract) => {
        const memberCount = 100; // Assuming a max of 100 members for iteration
        const memberDetails = []
        for (let i = 0; i < memberCount; i++) {
            try {
                const memberAddress = await contract.daoMembers(i);
                const memberStake = await contract.stakes(memberAddress);
                memberDetails.push({ address: memberAddress, stake: ethers.utils.formatEther(memberStake) });
            } catch (error) {
                console.error('Failed to fetch member:', error);
                break; 
            }
        }
        setMembers(memberDetails);
    };
  
      const joinDAO = async () => {
          if (!daoContract) return;
          try {
              const txResponse = await daoContract.joinDAO({ value: ethers.utils.parseEther("10") });
              await txResponse.wait();
              alert('Successfully joined DAO!');
              fetchStakedAmount(daoContract, currentAccount);
              fetchFees(daoContract);
          } catch (error) {
              console.error('Failed to join DAO:', error);
              alert('Error joining DAO');
          }
      };
  
      const addStake = async () => {
          if (!daoContract || !additionalStake) return;
          try {
              const txResponse = await daoContract.addStake({ value: ethers.utils.parseEther(additionalStake) });
              await txResponse.wait();
              alert('Successfully added stake!');
              fetchStakedAmount(daoContract, currentAccount);
              fetchFees(daoContract);
              setAdditionalStake('');
          } catch (error) {
              console.error('Failed to add stake:', error);
              alert('Error adding stake');
          }
      };
  
      const withdrawStake = async () => {
          if (!daoContract || !withdrawAmount) return;
          try {
              const txResponse = await daoContract.leaveDAO(ethers.utils.parseEther(withdrawAmount));
              await txResponse.wait();
              alert('Successfully withdrawn stake!');
              fetchStakedAmount(daoContract, currentAccount);
              setWithdrawAmount('');
          } catch (error) {
              console.error('Failed to withdraw stake:', error);
              alert('Error withdrawing stake');
          }
      };

      
    const inputStyle = {
        flex: '1',
        marginRight: '10px',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc'
    };

    const buttonStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        cursor: 'pointer'
    };

    const cardStyle = {
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '10px',
        flex: '1 1 calc(33.333% - 20px)',
        margin: '10px',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        color: 'white'
    };
    
    

    return (
        <div>
            <div style={headerStyle}>
                <h1 style={{ color: 'white' }}>Manage and contoled you DAO joined Account</h1>
                <button onClick={joinDAO} style={buttonStyle}>Join DAO</button>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            }}>
                <div style={cardStyle}>
                    <p>Staked Amount: {stakedAmount} {ticker}</p>
                </div>
                <div style={cardStyle}>
                    <p>Total Proposal Fees Collected: {totalProposalFees} {ticker}</p>
                </div>
                <div style={cardStyle}>
                    <p>Total Request Fees Collected: {totalRequestFees} {ticker}</p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={cardStyle}>
                <input
                    type="text"
                    value={additionalStake}
                    onChange={e => setAdditionalStake(e.target.value)}
                    placeholder={`Amount to stake (${ticker})`}
                    style={inputStyle}
                />
                <button onClick={addStake} style={buttonStyle}>Add Stake</button>
            </div>
            <div style={cardStyle}>
                <input
                    type="text"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder={`Amount to unstake (${ticker})`}
                    style={inputStyle}
                />
                <button onClick={withdrawStake} style={buttonStyle}>Withdraw Stake</button>
            </div>
            </div>
            <div>
            <h1 style={{ color: 'white' }}>DAO Members</h1>
            </div>
            <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={cardStyle}>
                    <h2>Address</h2>
                </div>
                <div style={cardStyle}>
                    <h2>Staked Amounts</h2>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={cardStyle}>
                    {members.map((member, index) => (
                        <div key={index} style={cardStyle}>
                            <p>{member.address}</p>
                        </div>
                    ))}
                </div>
                <div style={cardStyle}>
                    {members.map((member, index) => (
                        <div key={index} style={cardStyle}>
                            <p>{member.stake} {ticker}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
};

export default DAO;

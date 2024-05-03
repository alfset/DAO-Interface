// src/components/DAO.js
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import OracleABI from '../utils/abis/Oralce_ABI.json';  // Ensure the path is correct

const contractAddress = '0xE62a3277429B9F26C466D31157D50CaE97561e7C';

const DAO = () => {
    const { currentAccount, networkProvider } = useContext(AppContext);
    const [daoContract, setDaoContract] = useState(null);
    const [stakedAmount, setStakedAmount] = useState('0');
    const [additionalStake, setAdditionalStake] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [totalProposalFees, setTotalProposalFees] = useState('0');
    const [totalRequestFees, setTotalRequestFees] = useState('0');

    useEffect(() => {
        if (networkProvider && currentAccount) {
            const signer = networkProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, OracleABI, signer);
            setDaoContract(contract);
            fetchStakedAmount(contract, currentAccount);
            fetchFees(contract);
        }
    }, [networkProvider, currentAccount]);

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
        marginBottom: '10px',
        flex: '1 1 calc(33.333% - 20px)',
        margin: '10px',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        color: 'white'  // Set the text color to white for the header
    };

    return (
        <div>
            <div style={headerStyle}>
                <h1 style={{ color: 'white' }}>DAO</h1>
                <button onClick={joinDAO} style={buttonStyle}>Join DAO</button>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            }}>
                <div style={cardStyle}>
                    <p>Staked Amount: {stakedAmount} TPLANQ</p>
                </div>
                <div style={cardStyle}>
                    <p>Total Proposal Fees Collected: {totalProposalFees} TPLANQ</p>
                </div>
                <div style={cardStyle}>
                    <p>Total Request Fees Collected: {totalRequestFees} TPLANQ</p>
                </div>
            </div>
            <div style={cardStyle}>
                <input
                    type="text"
                    value={additionalStake}
                    onChange={e => setAdditionalStake(e.target.value)}
                    placeholder="Amount to stake (TPLANQ)"
                    style={inputStyle}
                />
                <button onClick={addStake} style={buttonStyle}>Add Stake</button>
            </div>
            <div style={cardStyle}>
                <input
                    type="text"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="Amount to unstake (TPLANQ)"
                    style={inputStyle}
                />
                <button onClick={withdrawStake} style={buttonStyle}>Withdraw Stake</button>
            </div>
        </div>
    );
};

export default DAO;

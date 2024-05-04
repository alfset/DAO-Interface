import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import OracleABI from '../utils/abis/Oralce_ABI.json';  // Ensure the ABI is updated with the latest methods

const contractAddress = '0xE62a3277429B9F26C466D31157D50CaE97561e7C';

const Governance = () => {
    const { currentAccount, networkProvider } = useContext(AppContext);
    const [daoContract, setDaoContract] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [newProposalDescription, setNewProposalDescription] = useState('');

    useEffect(() => {
        if (networkProvider && currentAccount) {
            const signer = networkProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, OracleABI, signer);
            setDaoContract(contract);
            fetchProposals();
        }
    }, [networkProvider, currentAccount]);

    const fetchProposals = async () => {
        const proposalCount = await daoContract.getProposalCount();
        const fetchedProposals = [];
        for (let i = 0; i < proposalCount; i++) {
            const proposal = await daoContract.proposals(i);
            fetchedProposals.push(proposal);
        }
        setProposals(fetchedProposals);
    };

    const handleNewProposal = async () => {
        if (!daoContract || !newProposalDescription) return;

        try {
            const txResponse = await daoContract.openProposal(newProposalDescription, {
                value: ethers.utils.parseEther("10") 
            });
            await txResponse.wait();
            fetchProposals();  // Refresh the list of proposals
            setNewProposalDescription('');  // Clear the input field
            alert('Proposal submitted successfully!');
        } catch (error) {
            console.error('Failed to submit proposal:', error);
            alert('Error submitting proposal');
        }
    };

    const buttonStyle = {
      marginRight: '1',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#4CAF50',
      color: 'white',
      cursor: 'pointer'
  };

  const inputStyle = {
        flex: '100',
        marginRight: '10px',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc'
    };

    return (
      <div>
          <h1>DAO Proposals</h1>
          <div>
              <input 
                  style={inputStyle}
                  type="text"
                  value={newProposalDescription}
                  onChange={(e) => setNewProposalDescription(e.target.value)}
                  placeholder="Enter your proposal"
              />
              <button onClick={handleNewProposal} style={buttonStyle}>Submit Proposal</button>
          </div>
          <h2>Active Proposals</h2>
          <ul>
              {proposals.map((proposal, index) => (
                  <li key={index}>
                      {proposal.description} - {proposal.active ? 'Active' : 'Inactive'}
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default Governance;
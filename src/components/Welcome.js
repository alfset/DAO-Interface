import React, { useEffect, useState } from 'react';
import Card from './card';
import { fetchTotalStaked, fetchTotalMembers, fetchChainSupported, fetchDataSupported } from '../utils/contract/contractInteraction';
import DescriptionCard from './DeskripsiCard';
import { ethers } from 'ethers';
import { contractAddresses, tickers } from '../utils/chain-contants'
import { listenToPriceUpdates } from '../utils/contract/updatePriceListener';


const priceIdToSymbolMapping = {
    '0x6b9c07fe23f215a1f80037675a66d0d3b2d6a615ca8d9ebf5c206020a08a8bc2': 'PLANQ',
    '0x76006b5e0ca09625ddd70fb8822c5108f0f8565f9c64d99cc09fdf4de0d84916': 'PLANQ',
    '0x7eda6ac7bea153fb1ce89a2af0bd3ce7ce49c7ec880ec1dbf350f8b0d6e3db7d': 'ethereum',

};

const HomePage = () => {
    const [totalStaked, setTotalStaked] = useState('Loading...');
    const [totalMembers, setTotalMembers] = useState('Loading...');
    const [totalChains, setTotalChains] = useState('Loading...');
    const [totalData, setTotalData] = useState('Loading...');
    const [priceUpdates, setPriceUpdates] = useState({});


    useEffect(() => {
        fetchTotalStaked().then(setTotalStaked).catch(console.error);
        fetchTotalMembers().then(setTotalMembers).catch(console.error);
        fetchChainSupported().then(setTotalChains).catch(console.error);
        fetchDataSupported().then(setTotalData).catch(console.error);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const unsubscribes = [];

        Object.entries(contractAddresses).forEach(([chainId, address]) => {
            const unsubscribe = listenToPriceUpdates(address, provider, (update) => {
                const updatedPriceId = update.priceId.toLowerCase();
                const symbolOverride = priceIdToSymbolMapping[updatedPriceId];
                setPriceUpdates(prevUpdates => {
                    const newUpdates = {
                        ...prevUpdates,
                        [tickers[chainId]]: [
                            ...(prevUpdates[tickers[chainId]] || []).slice(-2),
                            {
                                ...update,
                                priceId: symbolOverride || update.priceId,
                                symbol: symbolOverride ? symbolOverride : tickers[chainId]
                            }
                        ]
                    };
                    localStorage.setItem('priceUpdates', JSON.stringify(newUpdates));
                    return newUpdates;
                });
            });
            unsubscribes.push(unsubscribe);
        });

        return () => {
            unsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, []);
    return (
        <div className="home-page-container mx-auto max-w-7xl p-8">
            <div className="introduction text-white">
                <h2 className="text-2xl font-bold">Latest Price Update</h2>
            </div>
            <div className="stats-cards grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-8">
            {Object.entries(priceUpdates).map(([ticker, updates]) => (
                updates.map((update, index) => (
                    <Card key={`${ticker}-${index}`} title={`Chain ${ticker} `} value={`ID: ${update.symbol || update.priceId}, Price: ${update.price} $`} />
                ))
            ))}
            </div>
            <div className="stats-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <Card title="Total Staked" value={totalStaked} />
                <Card title="Chains Supported" value={totalChains} />
                <Card title="Data Supported" value={totalData} />
                <Card title="Total Reward Distributed" value={totalMembers} />
            </div>
            <div className="introduction text-white mt-8 p-4">
                <h2 className="text-2xl font-bold">Welcome to Oracle DAO Controlized</h2>
                <p className="text-lg mt-4">
                    At Oracle DAO Controlized, we are at the forefront of blockchain technology, committed to nurturing and advancing projects built on both EVM and WASM protocols.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DescriptionCard 
                    title="Advanced Blockchain Integration"
                    content="Oracle DAO Controlized integrates cutting-edge blockchain technology to ensure seamless interoperability between EVM and WASM protocols contract, enhancing the efficiency and scalability of decentralized applications."
                />
                <DescriptionCard 
                    title="Decentralized Governance"
                    content="Our DAO promotes a decentralized governance structure, allowing every member to participate actively in decision-making processes that shape the future of our technologies and protocols."
                />
                <DescriptionCard 
                    title="Support for Multiple Chains"
                    content="We support a variety of blockchain platforms including EVM layer1, layer2 and manymore ensuring that developers have the flexibility to work with their preferred technologies."
                />
                <DescriptionCard 
                    title="Oracle Services"
                    content="Explore how our Oracle services can be utilized within smart contracts to facilitate reliable, real-time data exchange and enhance the functionality of decentralized applications."
                />
            </div>
        </div>
    );
};

export default HomePage;
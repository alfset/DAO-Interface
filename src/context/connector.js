import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  7077: 'https://evm-rpc-atlas.planq.network',
  7070: 'https://evm-rpc.planq.network'
};

export const injected = new InjectedConnector({ supportedChainIds: [7077, 7070] });

export const walletconnect = new WalletConnectConnector({
  rpc: { 7077: RPC_URLS[7077] }, 
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

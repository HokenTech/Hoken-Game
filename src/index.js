import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Anchor } from "ual-anchor";
import { EOSIOAuth } from "ual-eosio-reference-authenticator";
import { Ledger } from "ual-ledger";
import { Lynx } from "ual-lynx";
import { MeetOne } from "ual-meetone";
import { Metamask } from 'ual-metamask';
import { UALProvider } from "ual-reactjs-renderer";
import { TokenPocket } from "ual-token-pocket";
import { App } from './components';
import store from './store';



const chain = {
  chainId: process.env.REACT_APP_CHAIN_ID,
  rpcEndpoints: [{
    protocol: process.env.REACT_APP_EOS_PROTOCOL,
    host: process.env.REACT_APP_EOS_HOST,
    port: process.env.REACT_APP_EOS_PORT,
  }],
};
const appName = process.env.REACT_APP_EOS_APP_NAME;

// Authenticators
const eosioAuth = new EOSIOAuth([chain], { appName, protocol: "eosio" });
const lynx = new Lynx([chain]);
const tokenPocket = new TokenPocket([chain], { appName });
const anchor = new Anchor([chain], { appName, disableGreymassFuel: true });
const ledger = new Ledger([chain]);
const meetOne = new MeetOne([chain]);
const metamask = new Metamask([chain])
const supportedChains = [chain];
const supportedAuthenticators = [eosioAuth, anchor, lynx, ledger, tokenPocket, meetOne, metamask];

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UALProvider chains={supportedChains} authenticators={supportedAuthenticators} appName={appName}>
    <Provider store={store}>
      <App />
    </Provider>
  </UALProvider >
);

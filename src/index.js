import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Navbar from "./components/Navbar";

import { Provider } from "@self.id/framework";

import { chain, createClient, WagmiProvider } from "wagmi";
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import HomePage from "./components/HomePage";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import IPFS from "./components/IPFS";
import Create from "./components/Create";

const { chains, provider } = configureChains(
  [chain.mainnet,chain.ropsten, chain.polygonMumbai, chain.rinkeby, chain.polygon],
  [apiProvider.alchemy(process.env.POLYGON_ALCHEMY), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiProvider client={wagmiClient}>
    <RainbowKitProvider
      chains={chains}
      theme={darkTheme({
        accentColor: "#7b3fe4",
        accentColorForeground: "white",
        borderRadius: "medium",
        fontStack: "system",
      })}
    >
      <Provider client={{ ceramic: "testnet-clay" }}>
        <React.StrictMode>
          <Navbar />
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sign" element={<IPFS/>} />
              <Route path="/home" element={< Home/>} />
              <Route path="/auth" element={< Auth/>} />
              <Route path="/create" element={<Create></Create>} />
              
            </Routes>
          </Router>
         
        </React.StrictMode>
      </Provider>
    </RainbowKitProvider>
  </WagmiProvider>
);

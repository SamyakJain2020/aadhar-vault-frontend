import React,{useState} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
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
import App from "./App";


const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.ropsten,
    chain.polygonMumbai,
    chain.rinkeby,
    chain.polygon,
  ],
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
          <App></App>
        </React.StrictMode>
      </Provider>
    </RainbowKitProvider>
  </WagmiProvider>
);

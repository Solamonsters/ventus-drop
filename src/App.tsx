import "./App.css";
import { useMemo } from "react";

import Minter from "./Minter";

import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSolflareWallet,
  getSlopeWallet,
  getSolletWallet,
  getMathWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { ThemeProvider, createTheme } from "@material-ui/core";


const theme = createTheme({
  palette: {
    type: "dark",
  },
});

const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID
  ? new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID)
  : undefined;

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [getPhantomWallet(), getSolflareWallet(), getSlopeWallet(), getSolletWallet(), getMathWallet() ],
    []
  );

  // function toggleMenu() {
  //   const menu = document.getElementById("mobileNavContainer")!;
  //   menu.classList.toggle("open-menu");
  //   console.log("pressed");
  // }

  return (
    <div>
      <div className="content-wrapper">
          <header className="container card mintCard" id="link1">
            <div style={{ padding: "0 24px 0 24px 0" }}>
              <h1 className="pb-3">The Solamonsters Society</h1>
 
            </div>
            <div className="mintBox">
              <ThemeProvider theme={theme}>
                <ConnectionProvider endpoint={endpoint}>
                  <WalletProvider wallets={wallets} autoConnect>
                    <WalletDialogProvider>                     
                        <Minter
                          candyMachineId={candyMachineId}
                          connection={connection}
                          startDate={startDateSeed}
                          txTimeout={txTimeout}
                          rpcHost={rpcHost}
                        />                      
                    </WalletDialogProvider>
                  </WalletProvider>
                </ConnectionProvider>
              </ThemeProvider>
            </div>
          </header>

          {/* <div id="link2" className="container faq card">
            <h1 style={{ padding: "0 0 24px 0" }}>FAQ</h1>
            <div>
              <h4>Lorem ipsum?</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                id metus id mauris tincidunt posuere. Vivamus neque odio, imperdiet
                vitae.
              </p>

              <hr />
            </div>

            <div>
              <h4>Lorem ipsum?</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                id metus id mauris tincidunt posuere. Vivamus neque odio, imperdiet
                vitae.
              </p>

              <hr />
            </div>

            <div>
              <h4>Lorem ipsum?</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                id metus id mauris tincidunt posuere. Vivamus neque odio, imperdiet
                vitae.
              </p>

              <hr />
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default App;

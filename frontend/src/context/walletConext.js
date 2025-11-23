import { createContext, useContext, useState } from "react";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [wallet, setWallet] = useState(null);

  const connect = async (provider) => {
    // Only use browser wallet extensions (window.BCH)
    setWallet(wallet);
    setWalletAddress(await wallet.getAddress());
  };

  const disconnect = () => {
    setWallet(null);
    setWalletAddress(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, walletAddress, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);

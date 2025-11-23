import React, { createContext, useContext, useState, useEffect } from "react";
// Removed web3modal-connector import (not needed)

const WalletContext = createContext(null);


// No-op WalletProvider for compatibility; not used with mainnet-js
export function WalletProvider({ children }) {
  return <>{children}</>;
}

// No-op useWallet for compatibility; not used with mainnet-js
export const useWallet = () => ({});

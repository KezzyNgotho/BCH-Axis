export const BCH_EXTENSION = 'bch_extension';

export const detectBCHWallet = () => {
  if (window.bitcoin) return "Badger";
  if (window.paytaca) return "Paytaca";
  return null;
};

export const connectBCHWallet = async () => {
  const walletName = detectBCHWallet();
  if (!walletName) {
    alert("BCH wallet extension not found. Please install Badger or Paytaca.");
    return null;
  }

  try {
    const provider = walletName === "Badger" ? window.bitcoin : window.paytaca;
    const accounts = await provider.request({ method: "enable" });
    if (!accounts || accounts.length === 0) throw new Error("No accounts found");
    const address = accounts[0];
    localStorage.setItem(BCH_EXTENSION, JSON.stringify({ address, walletName }));
    return { address, walletName };
  } catch (err) {
    console.error("Wallet connect failed:", err);
    alert(err.message);
    return null;
  }
};

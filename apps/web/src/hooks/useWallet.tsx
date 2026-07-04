import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
  type ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";

export type UserRole = "INSTITUTION" | "STUDENT" | "VERIFIER" | null;

interface WalletContextValue {
  address: string | null;
  role: UserRole;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setRole: (role: UserRole) => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: "freighter",
  modules: [new FreighterModule()],
});

const STORAGE_KEY = "anchorpass:wallet";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRoleState] = useState<UserRole>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // restore a lightweight session (address + role) so refresh doesn't
  // force a re-connect; Freighter itself still gates every signature.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { address: string; role: UserRole };
        setAddress(parsed.address);
        setRoleState(parsed.role);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = useCallback((next: { address: string | null; role: UserRole }) => {
    if (next.address) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          kit.setWallet(option.id);
          const { address: pubKey } = await kit.getAddress();
          setAddress(pubKey);
          persist({ address: pubKey, role });
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [role, persist]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setRoleState(null);
    persist({ address: null, role: null });
  }, [persist]);

  const setRole = useCallback(
    (nextRole: UserRole) => {
      setRoleState(nextRole);
      persist({ address, role: nextRole });
    },
    [address, persist]
  );

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!address) throw new Error("Wallet not connected");
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        address,
        networkPassphrase: WalletNetwork.TESTNET,
      });
      return signedTxXdr;
    },
    [address]
  );

  return (
    <WalletContext.Provider
      value={{ address, role, isConnecting, error, connect, disconnect, setRole, signTransaction }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

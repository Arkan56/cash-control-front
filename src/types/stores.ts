import type { StoreVault } from "./vault";

export interface Stores {
  id: number;
  name: string;
}

export interface StoreDetail {
  id: number;
  name: string;
  balance: number;
  vaults: StoreVault[];
}

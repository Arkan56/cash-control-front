export interface Vault {
  id: number;
  name: string;
  store_name: string;
  balance: number;
}
export interface StoreVault {
  id: number;
  store_id: number;
  name: string;
  balance: number;
}

import { apiFetch, setToken } from "./cliente";

// --- Auth ---
export const loginUser = async (userName: string, password: string) => {
  const data = await apiFetch("/auth/login/user", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ user_name: userName, password }),
  });
  setToken(data.token);
  return data;
};

export const fetchVault = async (vault_id: number) => {
  return apiFetch(`/api/core/vaults/${vault_id}`);
};

// --- Core ---
export const fetchMovements = async (vault_id: number) => {
  return apiFetch(`/api/core/movements/vault/${vault_id}`);
};

export const createMovement = async (payload: {
  detail: string;
  amount: number;
  amount_category_id: number;
  vault_id: number;
}) => {
  return apiFetch(`/api/core/movements/${payload.vault_id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const fetchVaults = async (store_id: number) => {
  return apiFetch(`/api/core/store/vaults/${store_id}`);
};

export const fetchStores = async () => {
  return apiFetch("/api/core/stores");
};

// --- Admin ---
export const createStore = async (payload: { name: string }) => {
  return apiFetch("/api/admin/stores", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const createVault = async (payload: {
  store_id: number;
  name: string;
}) => {
  return apiFetch("/api/admin/vaults", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const createUser = async (payload: {
  user_name: string;
  name: string;
  password: string;
}) => {
  return apiFetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const fetchAdminStores = async () => {
  return apiFetch("/api/admin/stores");
};

export const fetchUsers = async () => {
  return apiFetch("/api/admin/users");
};

export const fetchUser = async (userId: number) =>
  apiFetch(`/api/admin/users/${userId}`);

export const fetchStoreAccess = async (userId: number) =>
  apiFetch(`/api/admin/storesacces/${userId}`);

export const fetchVaultAccess = async (userId: number) =>
  apiFetch(`/api/admin/vaultsacces/${userId}`);

export const fetchAdminVaults = async () =>
  apiFetch("/api/admin/vaults");

export async function syncUserAccess(
  userId: number,
  data: { store_ids: number[]; vault_ids: number[] }
) {
  return apiFetch(`/api/admin/users/${userId}/access`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
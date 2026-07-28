import { apiFetch, setToken } from "./cliente";

// --- Auth ---
export const loginUser = async (userName: string, password: string) => {
  const data = await apiFetch("/auth/login/user", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ user_name: userName, password }),
  });
  setToken(data.token); // ajusta el nombre del campo según lo que devuelva tu handler
  return data;
};

export const loginVault = async (vault_id: number, password: string) => {
  return apiFetch("/api/core/auth/login/vault", {
    method: "POST",
    body: JSON.stringify({ vault_id, password }),
  });
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
  user_id: number;
}) => {
  return apiFetch("/api/core/movements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const fetchVaults = async (storeId: number) => {
  return apiFetch(`/api/core/vaults/${storeId}`);
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
  password: string;
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
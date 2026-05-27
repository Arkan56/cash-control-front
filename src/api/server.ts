const BASE_URL = "http://localhost:3000";

export const fetchMovements = async () => {
  const response = await fetch(`${BASE_URL}/movements/vault/1`);
  if (!response.ok) {
    throw new Error("Failed to fetch movements");
  }
  return response.json();
};

export const createMovement = async (payload: {
  detail: string;
  amount: number;
  amount_category_id: number;
  vault_id: number;
  user_id: number;
}) => {
  const response = await fetch(`${BASE_URL}/movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Error al crear movimiento");
  return response.json();
};

export const FetchVaults = async (storeId: number) => {
  const response = await fetch(`${BASE_URL}/vaults/${storeId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch vaults");
  }
  return response.json();
};

export const loginVault = async (vault_id: number, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/login/vault`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vault_id, password }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message ?? "Contraseña incorrecta");
  }

  return response.json();
};

export const fetchStores = async () => {
  const response = await fetch(`${BASE_URL}/stores`);
  console.log("fetching stores");
  if (!response.ok) {
    throw new Error("Failed to fetch Stores");
  }
  return response.json();
};

export const createStore = async (payload: { name: string }) => {
  const response = await fetch(`${BASE_URL}/stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Error al crear local");
  return response.json();
};

export const createVault = async (payload: {
  store_id: number;
  name: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/vaults`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Error al crear local");
  return response.json();
};

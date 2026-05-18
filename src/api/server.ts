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

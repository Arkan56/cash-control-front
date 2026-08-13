import { useEffect, useState } from "react";
import { fetchMovements, fetchVault } from "../api/server";
import { useNavigate, useParams } from "react-router";
import type { Vault } from "../types/vault";

interface Movements {
  id: number;
  created_at: string;
  detail: string;
  amount: number;
  //amount_category_id: number;
  //vault_id: number;
  user_name: string;
}

const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value: number): string => {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Math.abs(value)); // Use Math.abs if you want to handle the sign manually

  // If the value was negative, we prepend the minus sign
  return value < 0 ? `- ${formatted}` : `  ${formatted}`;
};

function MovementsPage() {
  const [vault, setVault] = useState<Vault | null>(null);
  const [moveList, setMoveList] = useState<Movements[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { vaultId } = useParams();
  const navigate = useNavigate();

  const handleAddMov = () => {
    navigate(`/añadir-movimiento/${vaultId}`);
  };

  useEffect(() => {
    if (!vaultId) {
      navigate("/"); // o donde corresponda
      return;
    }

    loadData();
  }, [vaultId]);

  const loadData = async () => {
    try {
      const id = Number(vaultId);

      const vaultData = await fetchVault(id);
      setVault(vaultData);

      const movements = await fetchMovements(id);
      setMoveList(movements);
    } catch (err: any) {
      console.error(err);

      if (err.status === 403) {
        alert("No tienes acceso a esta cajilla.");
        navigate("/cajillas");
        return;
      }

      if (err.status === 404) {
        navigate("/404");
        return;
      }

      alert("Ocurrió un error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!vault) {
    return <div>No fue posible cargar la cajilla.</div>;
  }

  return (
    <div>
      <div className="font-bold text-2xl sm:text-right text-center p-10">
        <h2 className="">Local: {vault.store_name}</h2>
        <h1>{vault.name}</h1>
        <p>Saldo: {formatCurrency(vault.balance)}</p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleAddMov}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Agregar movimiento
        </button>
      </div>
      <div className="flex justify-center p-10">
        {moveList.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No hay movimientos registrados.
          </p>
        ) : (
          <ul className="w-full max-w-2xl">
            {moveList.map((m) => (
              <li key={m.id} className="w-full border-b py-2">
                <div className="flex justify-between w-full">
                  <span>
                    {formatDate(m.created_at)} - {m.detail} - {m.user_name}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(m.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MovementsPage;

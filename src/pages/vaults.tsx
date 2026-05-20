import { useNavigate, useParams } from "react-router";
import Grid from "../components/grid";
import type { Vault } from "../types/vault";
import { useEffect, useRef, useState } from "react";
import { FetchVaults, loginVault } from "../api/server";

function VaultsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [vaultsList, setVaultList] = useState<Vault[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedVaultId, setSelectedVaultId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVaultData();
  }, []);

  const fetchVaultData = async () => {
    try {
      const data = await FetchVaults();
      console.log(data);
      setVaultList(data);
    } catch (err) {
      console.error("Error fetching movements: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Abre el modal en vez de navegar directamente
  const handleVaultClick = (id: number) => {
    setSelectedVaultId(id);
    setPassword("");
    setAuthError("");
    setTimeout(() => passwordRef.current?.focus(), 50);
  };

  const handleCloseModal = () => {
    setSelectedVaultId(null);
    setPassword("");
    setAuthError("");
  };

  const handleAuth = async () => {
    if (!selectedVaultId) return;
    setIsAuthLoading(true);
    setAuthError("");

    try {
      const vaultData = await loginVault(selectedVaultId, password);
      navigate(`/movimientos/${selectedVaultId}`, {
        state: { vault: vaultData },
      });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const formattedVaults = vaultsList.map((v) => ({
    id: v.id,
    title: v.name,
  }));

  return (
    <>
      <h1>Cajillas del local {storeId}</h1>
      <Grid items={formattedVaults} onItemClick={handleVaultClick} />

      {/* Modal */}
      {selectedVaultId !== null && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-semibold mb-1">Acceso a cajilla</h2>
            <p className="text-sm text-gray-500 mb-4">
              Ingresa la contraseña para la cajilla #{selectedVaultId}
            </p>

            <input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Contraseña"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {authError && (
              <p className="text-red-500 text-xs mb-3">{authError}</p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCloseModal}
                className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAuth}
                disabled={isAuthLoading || !password}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium"
              >
                {isAuthLoading ? "Verificando..." : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VaultsPage;

import { useNavigate, useParams } from "react-router";
import Grid from "../../components/grid";
import Loading from "../../components/loading";
import type { Vault } from "../../types/vault";
import { useEffect, useState } from "react";
import { fetchVaults } from "../../api/server";

function VaultsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [vaultsList, setVaultList] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaultData = async () => {
    const storeIdNumber = Number(storeId);

    if (!storeIdNumber) {
      setError("El local seleccionado no es válido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await fetchVaults(storeIdNumber);

      setVaultList(data);
    } catch (err) {
      console.error("Error fetching vaults: ", err);

      setError("No fue posible cargar las cajillas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
  }, [storeId]);

  const formattedVaults = vaultsList.map((vault) => ({
    id: vault.id,
    title: vault.name,
  }));

  const handleVaultClick = (id: number) => {
    navigate(`/movimientos/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/tiendas")}
          className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          ← Volver a locales
        </button>

        <h1 className="text-3xl font-bold text-gray-900">Cajillas</h1>

        <p className="mt-2 text-gray-500">
          Selecciona la cajilla que deseas consultar.
        </p>
      </div>

      {/* Sección de cajillas */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Cajillas disponibles
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Selecciona una cajilla para consultar sus movimientos.
          </p>
        </div>

        {/* Cargando */}
        {loading && <Loading message="Cargando cajillas..." />}

        {/* Error */}
        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>

            <button
              onClick={fetchVaultData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Sin cajillas */}
        {!loading && !error && vaultsList.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🔐</div>

            <h3 className="font-semibold text-gray-800">
              No hay cajillas disponibles
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Actualmente no tienes acceso a ninguna cajilla en este local.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && vaultsList.length > 0 && (
          <Grid
            items={formattedVaults}
            onItemClick={handleVaultClick}
            icon="🔐"
            actionText="Ver movimientos"
          />
        )}
      </section>
    </div>
  );
}

export default VaultsPage;

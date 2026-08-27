import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { fetchVault, fetchVaults } from "../../api/server";

import Loading from "../../components/loading";
import type { Vault } from "../../types/vault";

function AdminStoreDetailPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [vaults, setVaults] = useState<Vault[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    if (!storeId) {
      navigate("/admin");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const id = Number(storeId);

      // Obtenemos las cajillas del local
      const vaultsData = await fetchVaults(id);

      // Obtenemos la información completa de cada cajilla
      const vaultsWithBalance = await Promise.all(
        vaultsData.map((vault: Vault) => fetchVault(vault.id)),
      );

      setVaults(vaultsWithBalance);
    } catch (err) {
      console.error("Error cargando información del local:", err);

      setError("No fue posible cargar la información del local.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalBalance = vaults.reduce(
    (total, vault) => total + vault.balance,
    0,
  );

  const storeName = vaults.length > 0 ? vaults[0].store_name : "Local";

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="mb-6 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          ← Volver al dashboard
        </button>

        <div className="border border-red-200 bg-red-50 rounded-xl p-6">
          <h2 className="font-semibold text-red-700">Ocurrió un problema</h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <button
            onClick={loadStoreData}
            className="mt-5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto">
      {/* Volver */}
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
      >
        ← Volver al dashboard
      </button>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{storeName}</h1>

        <p className="mt-2 text-gray-500">
          Consulta el resumen financiero y administra las cajillas del local.
        </p>
      </div>

      {/* Resumen */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Balance */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl text-2xl">
              💰
            </div>

            <div>
              <p className="text-sm text-gray-500">Balance total</p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {formatCurrency(totalBalance)}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Saldo acumulado entre todas las cajillas del local.
          </p>
        </div>

        {/* Número de cajillas */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl text-2xl">
            🔐
          </div>

          <p className="mt-4 text-sm text-gray-500">Cajillas</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {vaults.length}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Cajillas registradas en este local.
          </p>
        </div>
      </section>

      {/* Cajillas */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Cajillas del local
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Consulta el saldo y los movimientos de cada cajilla.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/crear-cajilla")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            + Crear cajilla
          </button>
        </div>

        {/* Lista */}
        {vaults.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4">🔐</div>

            <h3 className="text-lg font-semibold text-gray-800">
              No hay cajillas registradas
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Este local todavía no tiene cajillas registradas.
            </p>

            <button
              onClick={() => navigate("/admin/crear-cajilla")}
              className="mt-5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Crear primera cajilla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaults.map((vault) => (
              <button
                key={vault.id}
                onClick={() => navigate(`/movimientos/${vault.id}`)}
                className="text-left border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                      🔐
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {vault.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">Saldo actual</p>
                    </div>
                  </div>

                  <span className="text-gray-400">→</span>
                </div>

                <p className="mt-6 text-xl font-bold text-gray-900">
                  {formatCurrency(vault.balance)}
                </p>

                <p className="mt-4 text-sm font-medium text-blue-600">
                  Ver movimientos →
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminStoreDetailPage;

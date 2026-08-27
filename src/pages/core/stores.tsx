import { useEffect, useState } from "react";
import Grid from "../../components/grid";
import Loading from "../../components/loading";
import { useNavigate } from "react-router";
import { fetchStores } from "../../api/server";
import type { Stores } from "../../types/stores";

function StoresPage() {
  const [storeList, setStoreList] = useState<Stores[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchStores();

      setStoreList(data);
    } catch (err) {
      console.error("Error fetching stores: ", err);

      setError("No fue posible cargar los locales.");
    } finally {
      setLoading(false);
    }
  };

  const formattedStores = storeList.map((store) => ({
    id: store.id,
    title: store.name,
  }));

  const handleStoreClick = (id: number) => {
    navigate(`/cajillas/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Locales</h1>

        <p className="mt-2 text-gray-500">
          Selecciona el local en el que deseas realizar tus operaciones.
        </p>
      </div>

      {/* Sección de locales */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Locales disponibles
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Selecciona un local para consultar sus cajillas.
          </p>
        </div>

        {/* Cargando */}
        {loading && <Loading message="Cargando locales..." />}

        {/* Error */}
        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>

            <button
              onClick={fetchStoreData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Sin locales */}
        {!loading && !error && storeList.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🏪</div>

            <h3 className="font-semibold text-gray-800">
              No tienes locales asignados
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Actualmente no tienes acceso a ningún local.
            </p>
          </div>
        )}

        {/* Locales */}
        {!loading && !error && storeList.length > 0 && (
          <Grid
            items={formattedStores}
            onItemClick={handleStoreClick}
            icon="🏪"
            actionText="Ver cajillas"
          />
        )}
      </section>
    </div>
  );
}

export default StoresPage;

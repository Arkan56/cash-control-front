import { useNavigate } from "react-router";
import { fetchAdminStores } from "../../api/server";
import { useEffect, useState } from "react";
import type { Stores } from "../../types/stores";
import Grid from "../../components/grid";

function AdminDashboardPage() {
  const [storeList, setStoreList] = useState<Stores[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const data = await fetchAdminStores();
      setStoreList(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  const formattedStores = storeList.map((s) => ({
    id: s.id,
    title: s.name,
  }));

  const handleStoreClick = (storeId: number) => {
    navigate(`/admin/locales/${storeId}`);
  };

  return (
    <div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de administración
          </h1>

          <p className="mt-2 text-gray-500">Gestiona los recursos.</p>
        </div>

        {/* Acciones */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Acciones rápidas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/crear-local")}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg">
                +
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">Crear local</h3>

              <p className="mt-1 text-sm text-gray-500">
                Registra un nuevo local.
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/crear-cajilla")}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg">
                +
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">
                Crear cajilla
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Agrega una nueva cajilla.
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/crear-usuario")}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg">
                +
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">
                Crear usuario
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Registra un nuevo usuario.
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/usuarios")}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg">
                👥
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">Usuarios</h3>

              <p className="mt-1 text-sm text-gray-500">
                Consulta y administra usuarios.
              </p>
            </button>
          </div>
        </section>

        {/* Locales */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Mis locales
              </h2>

              <p className="text-sm text-gray-500">
                Selecciona un local para administrarlo.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/crear-local")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + Nuevo local
            </button>
          </div>

          <Grid
            items={formattedStores}
            onItemClick={handleStoreClick}
            icon="🏪"
            actionText="Administrar local"
          />
        </section>
      </main>
    </div>
  );
}

export default AdminDashboardPage;

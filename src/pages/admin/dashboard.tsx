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

  const handleCreateStore = () => navigate("/admin/crear-local");
  const handleCreateVault = () => navigate("/admin/crear-cajilla");
  const handleCreateUser = () => navigate("/admin/crear-usuario");

  const handleUsers = () => {
    navigate("/admin/usuarios");
  };

  const formattedStores = storeList.map((s) => ({
    id: s.id,
    title: s.name,
  }));

  return (
    <>
      <h1>Pagina admin</h1>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto p-4">
        <button
          onClick={handleCreateStore}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Crear local
        </button>

        <button
          onClick={handleCreateVault}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Crear cajilla
        </button>

        <button
          onClick={handleCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Crear usuario
        </button>

        <button
          onClick={handleUsers}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Ver usuarios
        </button>
      </div>

      <Grid items={formattedStores} />
    </>
  );
}

export default AdminDashboardPage;

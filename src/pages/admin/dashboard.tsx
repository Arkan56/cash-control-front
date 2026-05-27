import { useNavigate } from "react-router";
import StoresPage from "../stores";
import { fetchStores } from "../../api/server";
import { useEffect, useState } from "react";
import type { Stores } from "../../types/stores";
import Grid from "../../components/grid";

function AdminDashboardPage() {
  const [storeList, setStoreList] = useState<Stores[]>([]);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const data = await fetchStores();
      setStoreList(data);
    } catch (err) {
      console.error("Error fetching stores: ", err);
    }
  };

  const navigate = useNavigate();

  const handleCreateStore = () => {
    navigate("/admin/crear-local");
  };

  const handleCreateVault = () => {
    navigate("/admin/crear-cajilla");
  };

  const formattedStores = storeList.map((s) => ({
    id: s.id,
    title: s.name,
  }));

  return (
    <>
      <h1>Pagina admin</h1>
      <div className="grid grid-cols-2 grid-rows-1 gap-4 max-w-md mx-auto p-4">
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
      </div>
      <Grid items={formattedStores} />
    </>
  );
}

export default AdminDashboardPage;

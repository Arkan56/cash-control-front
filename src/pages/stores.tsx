import { useEffect, useState } from "react";
import Grid from "../components/grid";
import { useNavigate } from "react-router";
import { fetchStores } from "../api/server";
import type { Stores } from "../types/stores";

function StoresPage() {
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

  const formattedStores = storeList.map((s) => ({
    id: s.id,
    title: s.name,
  }));

  const handleStoreClick = (id: number) => {
    navigate(`/cajillas/${id}`);
  };
  return (
    <>
      <h1>Locales</h1>
      <Grid items={formattedStores} onItemClick={handleStoreClick} />
    </>
  );
}

export default StoresPage;

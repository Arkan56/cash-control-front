import Grid from "../components/grid";
import { useNavigate } from "react-router";

interface Stores {
  id: number;
  name: string;
}

function StoresPage() {
  const navigate = useNavigate();
  const stores: Stores[] = [
    { id: 1, name: "Prado 1" },
    { id: 2, name: "Prado 2" },
    { id: 3, name: "San Cristobal" },
  ];

  const formattedStores = stores.map((s) => ({
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

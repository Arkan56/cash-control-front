import { useNavigate, useParams } from "react-router";
import Grid from "../components/grid";

type Vault = {
  id: number;
  name: string;
};

function VaultsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const vaults: Vault[] = [
    { id: 1, name: "Cajilla 1" },
    { id: 2, name: "Cajilla 2" },
    { id: 3, name: "Cajilla 3" },
  ];

  const handleVaultClick = (id: number) => {
    navigate(`/movimientos/${id}`);
  };

  const formattedVaults = vaults.map((v) => ({
    id: v.id,
    title: v.name,
  }));

  return (
    <>
      <h1>Cajillas del local {storeId}</h1>

      <Grid items={formattedVaults} onItemClick={handleVaultClick} />
    </>
  );
}

export default VaultsPage;

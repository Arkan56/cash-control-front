import { useNavigate, useParams } from "react-router";
import Grid from "../components/grid";
import type { Vault } from "../types/vault";
import { useEffect, useState } from "react";
import { fetchVaults } from "../api/server";

function VaultsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [vaultsList, setVaultList] = useState<Vault[]>([]);

  useEffect(() => {
    fetchVaultData();
  }, []);

  const fetchVaultData = async () => {
    try {
      const data = await fetchVaults(Number(storeId));
      console.log(data);
      setVaultList(data);
    } catch (err) {
      console.error("Error fetching vaults: ", err);
    }
  };

  // Abre el modal en vez de navegar directamente
  const handleVaultClick = (id: number) => {
    const vault = vaultsList.find((v) => v.id === id) ?? null;
    navigate(`/movimientos/${vault?.id}`);
  };

  const formattedVaults = vaultsList.map((v) => ({
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

import Grid from "../components/grid";

type Vault = {
  id: number;
  name: string;
};

function VaultsPage() {
  const vaults: Vault[] = [
    { id: 1, name: "Cajilla 1" },
    { id: 2, name: "Cajilla 2" },
    { id: 3, name: "Cajilla 3" },
  ];

  const formattedVaults = vaults.map((v) => ({
    id: v.id,
    title: v.name,
  }));
  return (
    <>
      <div>
        <h1>Cajillas del local</h1>
      </div>

      <Grid items={formattedVaults} />
    </>
  );
}

export default VaultsPage;

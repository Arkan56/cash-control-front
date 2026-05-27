import { useEffect, useState } from "react";
import { createVault, fetchStores } from "../../api/server";
import { useNavigate } from "react-router";

interface Store {
  id: number;
  name: string;
}

export default function CreateVaultPage() {
  const [stores, setStores] = useState<Store[]>([]);

  const [storeId, setStoreId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await fetchStores();
        setStores(data);
      } catch (error) {
        console.error(error);
        setMessage("Error cargando locales");
      }
    };

    loadStores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeId || !name || !password) {
      setMessage("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createVault({
        store_id: Number(storeId),
        name,
        password,
      });

      setMessage("Cajilla creada correctamente");

      setStoreId("");
      setName("");
      setPassword("");
      navigate(`/cajillas/${storeId}`);
    } catch (error) {
      console.error(error);
      setMessage("Error al crear cajilla");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Crear cajilla</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Local</label>

          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Seleccione un local</option>

            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Nombre de la cajilla</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Cajilla 1"
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Creando..." : "Crear cajilla"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}

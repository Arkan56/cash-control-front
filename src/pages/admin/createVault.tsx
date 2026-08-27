import { useEffect, useState } from "react";
import { createVault, fetchAdminStores } from "../../api/server";
import { useNavigate } from "react-router";

interface Store {
  id: number;
  name: string;
}

export default function CreateVaultPage() {
  const navigate = useNavigate();

  const [stores, setStores] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState("");
  const [name, setName] = useState("");

  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      try {
        setIsLoadingStores(true);
        setError(null);

        const data = await fetchAdminStores();

        setStores(data);
      } catch (error) {
        console.error("Error cargando locales:", error);

        setError("No fue posible cargar los locales.");
      } finally {
        setIsLoadingStores(false);
      }
    };

    loadStores();
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const trimmedName = name.trim();

    if (!storeId) {
      setError("Debes seleccionar un local.");
      return;
    }

    if (!trimmedName) {
      setError("Debes ingresar el nombre de la cajilla.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createVault({
        store_id: Number(storeId),
        name: trimmedName,
      });

      navigate("/admin");
    } catch (error) {
      console.error("Error al crear cajilla:", error);

      setError("No fue posible crear la cajilla. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Volver */}
      <button
        type="button"
        onClick={handleCancel}
        className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
      >
        ← Volver al panel
      </button>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear cajilla</h1>

        <p className="mt-2 text-gray-500">
          Registra una nueva cajilla y asígnala a uno de los locales
          disponibles.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
      >
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Local */}
        <div className="mb-5">
          <label
            htmlFor="store"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Local
          </label>

          <select
            id="store"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            disabled={isLoadingStores || isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">
              {isLoadingStores ? "Cargando locales..." : "Selecciona un local"}
            </option>

            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          {!isLoadingStores && stores.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              No hay locales disponibles. Debes crear un local antes de crear
              una cajilla.
            </p>
          )}
        </div>

        {/* Nombre */}
        <div className="mb-8">
          <label
            htmlFor="vaultName"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Nombre de la cajilla
          </label>

          <input
            id="vaultName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ej: Cajilla principal"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            Utiliza un nombre que permita identificar fácilmente la cajilla.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-5 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isLoadingStores || isSubmitting || stores.length === 0}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creando..." : "Crear cajilla"}
          </button>
        </div>
      </form>
    </div>
  );
}

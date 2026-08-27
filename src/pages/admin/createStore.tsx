import { useState } from "react";
import { createStore } from "../../api/server";
import { useNavigate } from "react-router";

export default function CreateStorePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Debes ingresar el nombre del local.");
      return;
    }

    try {
      setLoading(true);

      await createStore({
        name: trimmedName,
      });

      navigate("/admin");
    } catch (error) {
      console.error("Error al crear local:", error);

      setError("No fue posible crear el local. Intenta nuevamente.");
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Crear local</h1>

        <p className="mt-2 text-gray-500">
          Registra un nuevo local en el sistema para gestionar sus cajillas y
          operaciones.
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

        {/* Nombre */}
        <div className="mb-8">
          <label
            htmlFor="storeName"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Nombre del local
          </label>

          <input
            id="storeName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="Ej: Local Centro"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            Utiliza un nombre que permita identificar fácilmente el local.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-5 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando..." : "Crear local"}
          </button>
        </div>
      </form>
    </div>
  );
}

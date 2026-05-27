import { useState } from "react";
import { createStore } from "../../api/server";
import { useNavigate } from "react-router";

export default function CreateStorePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("El nombre es obligatorio");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createStore({ name });

      setMessage("Local creado correctamente");
      setName("");
      navigate("/admin");
    } catch (error) {
      setMessage("Error al crear local");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear local</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Nombre del local</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Local Centro"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Creando..." : "Crear local"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}

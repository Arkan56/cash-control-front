import { useState } from "react";
import { createUser } from "../../api/server";
import { useNavigate } from "react-router";

function CreateUserPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const trimmedUserName = userName.trim();
    const trimmedName = name.trim();

    if (!trimmedUserName) {
      setError("Debes ingresar un nombre de usuario.");
      return;
    }

    if (!trimmedName) {
      setError("Debes ingresar el nombre del usuario.");
      return;
    }

    if (!password) {
      setError("Debes ingresar una contraseña.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createUser({
        user_name: trimmedUserName,
        name: trimmedName,
        password,
      });

      navigate("/admin/usuarios");
    } catch (err) {
      console.error("Error al crear usuario:", err);

      setError("No fue posible crear el usuario. Intenta nuevamente.");
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
        ← Volver
      </button>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear usuario</h1>

        <p className="mt-2 text-gray-500">
          Registra un nuevo usuario para que pueda acceder al sistema.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
      >
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Nombre */}
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Nombre completo
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ej: Juan Pérez"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Usuario */}
        <div className="mb-5">
          <label
            htmlFor="userName"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Nombre de usuario
          </label>

          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ej: jperez"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            Este será el usuario utilizado para iniciar sesión.
          </p>
        </div>

        {/* Contraseña */}
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ingresa una contraseña"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            La contraseña permitirá al usuario acceder al sistema.
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
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserPage;

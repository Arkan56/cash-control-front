import { useState } from "react";
import { loginUser } from "../../api/server";
import { useNavigate } from "react-router";
import { decodeToken } from "../../api/auth";
import { ROLES } from "../../constants/roles";

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !password) {
      setErrorMessage("Ingresa tu usuario y contraseña.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await loginUser(userName, password);

      const payload = decodeToken(data.token);

      if (payload.user_rol_id === ROLES.ADMIN) {
        navigate("/admin");
        return;
      }

      if (payload.user_rol_id === ROLES.WORKER) {
        navigate("/tiendas");
        return;
      }

      setErrorMessage("Tu usuario no tiene un rol válido.");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      setErrorMessage(
        "No fue posible iniciar sesión. Verifica tu usuario y contraseña.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-sm">
            <span className="text-2xl font-bold text-white">$</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Control de efectivo
          </h1>

          <p className="mt-1 text-sm text-gray-500 text-center">
            Inicia sesión para acceder al sistema.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Bienvenido</h2>

            <p className="mt-1 text-sm text-gray-500">
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Usuario */}
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                Usuario
              </label>

              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={loading}
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                className="
                  mt-2
                  block
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-gray-100
                  disabled:cursor-not-allowed
                  transition
                "
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                className="
                  mt-2
                  block
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-gray-100
                  disabled:cursor-not-allowed
                  transition
                "
              />
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
                disabled:bg-blue-400
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Sistema de gestión y control de efectivo
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

import { NavLink, useNavigate } from "react-router";
import { logoutUser } from "../api/server";
import { decodeToken } from "../api/auth";
import { getToken } from "../api/cliente";
import { getRoleName, ROLES } from "../constants/roles";

export default function Header() {
  const navigate = useNavigate();

  const token = getToken();

  let rol = "Usuario";
  let rolId: number | null = null;

  if (token) {
    try {
      const payload = decodeToken(token);

      rolId = payload.user_rol_id;
      rol = getRoleName(rolId);
    } catch {
      rol = "Usuario";
      rolId = null;
    }
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const handleLogoClick = () => {
    navigate(rolId === ROLES.ADMIN ? "/admin" : "/tiendas");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <span className="text-lg font-bold text-white">$</span>
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold text-gray-800">
                Control de efectivo
              </h1>

              <p className="text-xs text-gray-500">{rol}</p>
            </div>
          </button>

          {/* Navegación */}
          <nav className="flex items-center gap-1">
            {rolId === ROLES.ADMIN && (
              <>
                <NavLink to="/admin" end className={navLinkClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/admin/usuarios" className={navLinkClass}>
                  Usuarios
                </NavLink>
              </>
            )}

            {rolId === ROLES.WORKER && (
              <NavLink to="/tiendas" className={navLinkClass}>
                Tiendas
              </NavLink>
            )}
          </nav>

          {/* Usuario */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-800">{rol}</p>

              <p className="text-xs text-gray-400">Sesión activa</p>
            </div>

            <button
              onClick={logoutUser}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

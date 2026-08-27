import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchUsers } from "../../api/server";
import type { User } from "../../types/user";
import Grid from "../../components/grid";
import Loading from "../../components/loading";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchUsers();

      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);

      setError("No fue posible cargar los usuarios.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (userId: number) => {
    navigate(`/admin/usuarios/${userId}`);
  };

  const getRoleName = (roleId: number) => {
    return roleId === 1 ? "Administrador" : "Trabajador";
  };

  const formattedUsers = users.map((user) => ({
    id: user.ID,
    title: user.Name,
    subtitle: `${user.UserName} · ${getRoleName(user.IdRol)}`,
  }));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>

          <p className="mt-2 text-gray-500">
            Consulta los usuarios registrados y administra sus accesos.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/crear-usuario")}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          + Crear usuario
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={loadUsers}
            className="mt-2 text-sm font-medium text-red-700 hover:underline"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {/* Usuarios */}
      {!error && (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Usuarios registrados
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Selecciona un usuario para consultar su información y configurar
              sus accesos.
            </p>
          </div>

          {users.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-4">👥</div>

              <h3 className="text-lg font-semibold text-gray-800">
                No hay usuarios registrados
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Crea un usuario para comenzar a administrar los accesos al
                sistema.
              </p>

              <button
                onClick={() => navigate("/admin/crear-usuario")}
                className="mt-5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Crear usuario
              </button>
            </div>
          ) : (
            <Grid
              items={formattedUsers}
              onItemClick={handleUserClick}
              icon="👤"
              actionText="Administrar usuario"
            />
          )}
        </section>
      )}
    </div>
  );
}

export default UsersPage;

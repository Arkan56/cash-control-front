import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchUsers } from "../../api/server";
import type { User } from "../../types/user";
import Grid from "../../components/grid";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleUserClick = (userId: number) => {
    navigate(`/admin/usuarios/${userId}`);
  };

  const formattedUsers = users.map((user) => ({
    id: user.ID,
    title: user.Name,
  }));

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>

      <Grid items={formattedUsers} onItemClick={handleUserClick} />
    </>
  );
}

export default UsersPage;

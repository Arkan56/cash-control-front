import { useState } from "react";
import { updateUser } from "../api/server";
import { ROLES, getRoleName } from "../constants/roles"; // adjust the path
import type { User } from "../types/user";

interface Props {
  user: User;
  onClose: () => void;
  onSaved: (user: User) => void;
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100";

export default function EditUserModal({ user, onClose, onSaved }: Props) {
  const [name, setName] = useState(user.Name);
  const [userName, setUserName] = useState(user.UserName);
  const [roleId, setRoleId] = useState(user.IdRol);
  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedUserName = userName.trim();

    if (!trimmedName) return setError("El nombre no puede estar vacío.");
    if (trimmedUserName.length < 3)
      return setError("El usuario debe tener al menos 3 caracteres.");
    if (password && password.length < 8)
      return setError("La contraseña debe tener al menos 8 caracteres.");

    const payload: Parameters<typeof updateUser>[1] = {};
    if (trimmedName !== user.Name) payload.name = trimmedName;
    if (trimmedUserName !== user.UserName) payload.user_name = trimmedUserName;
    if (roleId !== user.IdRol) payload.rol_id = roleId;
    if (password) payload.password = password;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      setSaving(true);
      const updated = await updateUser(user.ID, payload);
      onSaved(updated);
    } catch (err) {
      console.error(err);

      const status = (err as { status?: number }).status;
      if (status === 409) setError("Ese nombre de usuario ya existe.");
      else if (status === 400) setError("Los datos enviados no son válidos.");
      else setError("No fue posible actualizar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900">Editar usuario</h2>
        <p className="mt-1 mb-6 text-sm text-gray-500">
          Modifica solo lo que necesites cambiar.
        </p>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-800">
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            className={inputClass}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-800">
            Nombre de usuario
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={saving}
            className={inputClass}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-800">
            Rol
          </label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            disabled={saving}
            className={`${inputClass} bg-white`}
          >
            <option value={ROLES.WORKER}>{getRoleName(ROLES.WORKER)}</option>
            <option value={ROLES.ADMIN}>{getRoleName(ROLES.ADMIN)}</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-800">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={saving}
            autoComplete="new-password"
            placeholder="Déjalo vacío para no cambiarla"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-blue-300"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

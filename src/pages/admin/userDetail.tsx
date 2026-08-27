import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  fetchUser,
  fetchAdminStores,
  fetchAdminVaults,
  fetchStoreAccess,
  fetchVaultAccess,
  syncUserAccess,
} from "../../api/server";

import type { User } from "../../types/user";
import type { Stores } from "../../types/stores";
import Loading from "../../components/loading";

interface Vault {
  id: number;
  store_id: number;
  name: string;
}

interface StoreAccess {
  store_id: number;
}

interface VaultAccess {
  vault_id: number;
}

function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [stores, setStores] = useState<Stores[]>([]);
  const [vaults, setVaults] = useState<Vault[]>([]);

  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [selectedVaults, setSelectedVaults] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!userId) {
      navigate("/admin/usuarios");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [
        userData,
        storesData,
        vaultsData,
        storeAccessData,
        vaultAccessData,
      ] = await Promise.all([
        fetchUser(Number(userId)),
        fetchAdminStores(),
        fetchAdminVaults(),
        fetchStoreAccess(Number(userId)),
        fetchVaultAccess(Number(userId)),
      ]);

      setUser(userData);
      setStores(storesData);
      setVaults(vaultsData);

      setSelectedStores(
        storeAccessData.map((store: StoreAccess) => store.store_id),
      );

      setSelectedVaults(
        vaultAccessData.map((vault: VaultAccess) => vault.vault_id),
      );
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar la información del usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStore = (storeId: number) => {
    if (selectedStores.includes(storeId)) {
      const vaultIdsOfStore = vaults
        .filter((vault) => vault.store_id === storeId)
        .map((vault) => vault.id);

      setSelectedStores((current) => current.filter((id) => id !== storeId));

      setSelectedVaults((current) =>
        current.filter((id) => !vaultIdsOfStore.includes(id)),
      );
    } else {
      setSelectedStores((current) => [...current, storeId]);
    }
  };

  const toggleVault = (vaultId: number, storeId: number) => {
    if (selectedVaults.includes(vaultId)) {
      setSelectedVaults((current) => current.filter((id) => id !== vaultId));
    } else {
      setSelectedVaults((current) => [...current, vaultId]);

      if (!selectedStores.includes(storeId)) {
        setSelectedStores((current) => [...current, storeId]);
      }
    }
  };

  const save = async () => {
    if (!user || saving) return;

    try {
      setSaving(true);

      await syncUserAccess(user.ID, {
        store_ids: selectedStores,
        vault_ids: selectedVaults,
      });

      alert("Los accesos fueron guardados correctamente.");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar los accesos.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">Ocurrió un problema</h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Intentar nuevamente
            </button>

            <button
              onClick={() => navigate("/admin/usuarios")}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto">
      {/* Navegación */}
      <button
        onClick={() => navigate("/admin/usuarios")}
        className="mb-6 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
      >
        ← Volver a usuarios
      </button>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Información del usuario
        </h1>

        <p className="mt-2 text-gray-500">
          Consulta la información y administra los accesos del usuario.
        </p>
      </div>

      {/* Información del usuario */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-start gap-4">
          {/* Icono */}
          <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl text-2xl">
            👤
          </div>

          {/* Información principal */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.Name}</h2>

            <p className="mt-1 text-sm text-gray-500">
              {user.IdRol === 1 ? "Administrador" : "Trabajador"}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Usuario
              </p>

              <p className="mt-1 font-medium text-gray-800">{user.UserName}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Rol
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {user.IdRol === 1 ? "Administrador" : "Trabajador"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accesos */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Accesos del usuario
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Selecciona los locales y las cajillas a las que este usuario puede
            acceder.
          </p>
        </div>

        <div className="space-y-4">
          {stores.map((store) => {
            const storeVaults = vaults.filter(
              (vault) => vault.store_id === store.id,
            );

            const isStoreSelected = selectedStores.includes(store.id);

            return (
              <div
                key={store.id}
                className={`border rounded-xl transition ${
                  isStoreSelected
                    ? "border-blue-200 bg-blue-50/40"
                    : "border-gray-200"
                }`}
              >
                {/* Local */}
                <label className="flex items-center justify-between p-5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      🏪
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {store.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {storeVaults.length} cajilla
                        {storeVaults.length !== 1 ? "s" : ""} disponible
                        {storeVaults.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isStoreSelected}
                    onChange={() => toggleStore(store.id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </label>

                {/* Cajillas */}
                {storeVaults.length > 0 && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="mb-3 text-sm font-medium text-gray-600">
                      Cajillas disponibles
                    </p>

                    <div className="space-y-2">
                      {storeVaults.map((vault) => (
                        <label
                          key={vault.id}
                          className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-gray-50 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">🔐</span>

                            <span className="text-sm font-medium text-gray-700">
                              {vault.name}
                            </span>
                          </div>

                          <input
                            type="checkbox"
                            checked={selectedVaults.includes(vault.id)}
                            onChange={() => toggleVault(vault.id, store.id)}
                            className="w-4 h-4 accent-blue-600"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Acciones */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={() => navigate("/admin/usuarios")}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-blue-300"
          >
            {saving ? "Guardando cambios..." : "Guardar cambios"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default UserDetailPage;

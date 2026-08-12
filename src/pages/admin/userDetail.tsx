import { useEffect, useState } from "react";
import { useParams } from "react-router";

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

  const [user, setUser] = useState<User | null>(null);

  const [stores, setStores] = useState<Stores[]>([]);
  const [vaults, setVaults] = useState<Vault[]>([]);

  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [selectedVaults, setSelectedVaults] = useState<number[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!userId) return;

    try {
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

      setSelectedStores(storeAccessData.map((s: StoreAccess) => s.store_id));
      setSelectedVaults(vaultAccessData.map((v: VaultAccess) => v.vault_id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStore = (storeId: number) => {
    if (selectedStores.includes(storeId)) {
      // al quitar el store, quitamos también sus vaults
      const vaultIdsOfStore = vaults
        .filter((v) => v.store_id === storeId)
        .map((v) => v.id);

      setSelectedStores(selectedStores.filter((id) => id !== storeId));
      setSelectedVaults(
        selectedVaults.filter((id) => !vaultIdsOfStore.includes(id)),
      );
    } else {
      setSelectedStores([...selectedStores, storeId]);
    }
  };

  const toggleVault = (vaultId: number, storeId: number) => {
    if (selectedVaults.includes(vaultId)) {
      setSelectedVaults(selectedVaults.filter((id) => id !== vaultId));
    } else {
      // si marcan un vault, aseguramos que su store también quede marcado
      setSelectedVaults([...selectedVaults, vaultId]);
      if (!selectedStores.includes(storeId)) {
        setSelectedStores([...selectedStores, storeId]);
      }
    }
  };

  const save = async () => {
    if (!user || saving) return;

    setSaving(true);
    try {
      await syncUserAccess(user.ID, {
        store_ids: selectedStores,
        vault_ids: selectedVaults,
      });
      alert("Accesos guardados");
    } catch (err) {
      console.error(err);
      alert("Error guardando accesos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Información del usuario</h1>

      {user && (
        <div className="mb-8 bg-gray-100 rounded-lg p-4">
          <p>
            <strong>Nombre:</strong> {user.Name}
          </p>

          <p>
            <strong>Usuario:</strong> {user.UserName}
          </p>

          <p>
            <strong>Rol:</strong>{" "}
            {user.IdRol === 1 ? "Administrador" : "Trabajador"}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Accesos</h2>

      {stores.map((store) => (
        <div key={store.id} className="border rounded-lg p-4 mb-4">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={selectedStores.includes(store.id)}
              onChange={() => toggleStore(store.id)}
            />

            {store.name}
          </label>

          <div className="ml-8 mt-3">
            {vaults
              .filter((vault) => vault.store_id === store.id)
              .map((vault) => (
                <label key={vault.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedVaults.includes(vault.id)}
                    onChange={() => toggleVault(vault.id, store.id)}
                  />

                  {vault.name}
                </label>
              ))}
          </div>
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}

export default UserDetailPage;

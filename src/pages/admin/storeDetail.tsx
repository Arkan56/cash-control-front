import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { fetchStoreDetail, updateStore } from "../../api/server";

import Loading from "../../components/loading";
import type { StoreDetail } from "../../types/stores";

function AdminStoreDetailPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Store name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedStoreName, setEditedStoreName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    if (
      !storeId ||
      !Number.isInteger(Number(storeId)) ||
      Number(storeId) <= 0
    ) {
      navigate("/admin");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const storeData = await fetchStoreDetail(Number(storeId));

      setStore(storeData);
    } catch (err) {
      console.error("Error loading store details:", err);
      setError("Could not load store information.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Start editing
  const handleEditName = () => {
    if (!store) return;

    setEditedStoreName(store.name);
    setNameError(null);
    setIsEditingName(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedStoreName("");
    setNameError(null);
    setIsEditingName(false);
  };

  // Save new store name
  const handleSaveName = async () => {
    if (!store) return;

    const newName = editedStoreName.trim();

    if (!newName) {
      setNameError("The store name cannot be empty.");
      return;
    }

    if (newName === store.name) {
      setIsEditingName(false);
      return;
    }

    try {
      setIsSavingName(true);
      setNameError(null);

      await updateStore(store.id, { name: newName });

      setStore((prev) => (prev ? { ...prev, name: newName } : prev));

      setIsEditingName(false);
    } catch (err) {
      console.error("Error updating store name:", err);
      setNameError("Could not update the store name.");
    } finally {
      setIsSavingName(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !store) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="mb-6 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          ← Back to dashboard
        </button>

        <div className="border border-red-200 bg-red-50 rounded-xl p-6">
          <h2 className="font-semibold text-red-700">Something went wrong</h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "Store not found."}
          </p>

          <button
            onClick={loadStoreData}
            className="mt-5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
      >
        ← Back to dashboard
      </button>

      {/* Store header */}
      <div className="mb-8">
        {isEditingName ? (
          <div className="max-w-lg">
            <label
              htmlFor="store-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Store name
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="store-name"
                type="text"
                value={editedStoreName}
                onChange={(e) => setEditedStoreName(e.target.value)}
                maxLength={100}
                disabled={isSavingName}
                autoFocus
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {isSavingName ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={handleCancelEdit}
                  disabled={isSavingName}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>

            {nameError && (
              <p className="mt-2 text-sm text-red-600">{nameError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>

            <button
              onClick={handleEditName}
              title="Edit store name"
              aria-label="Edit store name"
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              ✏️
            </button>
          </div>
        )}

        <p className="mt-2 text-gray-500">
          View the financial summary and manage the store's vaults.
        </p>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total balance */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl text-2xl">
              💰
            </div>

            <div>
              <p className="text-sm text-gray-500">Total balance</p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {formatCurrency(store.balance)}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Total accumulated balance across all store vaults.
          </p>
        </div>

        {/* Vault count */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl text-2xl">
            🔐
          </div>

          <p className="mt-4 text-sm text-gray-500">Vaults</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {store.vaults.length}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Vaults registered in this store.
          </p>
        </div>
      </section>

      {/* Vaults */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Store vaults
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View the balance and movements of each vault.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/crear-cajilla")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            + Create vault
          </button>
        </div>

        {/* Vault list */}
        {store.vaults.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4">🔐</div>

            <h3 className="text-lg font-semibold text-gray-800">
              No vaults registered
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              This store doesn't have any registered vaults yet.
            </p>

            <button
              onClick={() => navigate("/admin/crear-cajilla")}
              className="mt-5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Create first vault
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {store.vaults.map((vault) => (
              <button
                key={vault.id}
                onClick={() => navigate(`/movimientos/${vault.id}`)}
                className="text-left border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                      🔐
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {vault.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Current balance
                      </p>
                    </div>
                  </div>

                  <span className="text-gray-400">→</span>
                </div>

                <p className="mt-6 text-xl font-bold text-gray-900">
                  {formatCurrency(vault.balance)}
                </p>

                <p className="mt-4 text-sm font-medium text-blue-600">
                  View movements →
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminStoreDetailPage;

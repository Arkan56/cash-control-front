import { useCallback, useEffect, useState } from "react";
import { fetchMovements, fetchVault } from "../../api/server";
import { useNavigate, useParams } from "react-router";
import type { Vault } from "../../types/vault";
import Loading from "../../components/loading";

interface Movements {
  id: number;
  created_at: string;
  detail: string;
  amount: number;
  user_name: string;
}

const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value: number): string => {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Math.abs(value));

  return value < 0 ? `- ${formatted}` : formatted;
};

function MovementsPage() {
  const [vault, setVault] = useState<Vault | null>(null);
  const [moveList, setMoveList] = useState<Movements[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialDateRange = getCurrentMonthRange();

  const [startDate, setStartDate] = useState(initialDateRange.startDate);
  const [endDate, setEndDate] = useState(initialDateRange.endDate);

  const [appliedStartDate, setAppliedStartDate] = useState(
    initialDateRange.startDate,
  );
  const [appliedEndDate, setAppliedEndDate] = useState(
    initialDateRange.endDate,
  );

  type MovementType = "all" | "income" | "expense";

  const [movementType, setMovementType] = useState<MovementType>("all");
  const [appliedMovementType, setAppliedMovementType] =
    useState<MovementType>("all");

  const { vaultId } = useParams();
  const navigate = useNavigate();

  const handleAddMov = () => {
    navigate(`/añadir-movimiento/${vaultId}`);
  };

  const filteredMovements = moveList.filter((movement) => {
    if (appliedMovementType === "income") {
      return movement.amount > 0;
    }

    if (appliedMovementType === "expense") {
      return movement.amount < 0;
    }

    return true;
  });

  const loadData = useCallback(async () => {
    const id = Number(vaultId);

    if (!id) {
      setError("La cajilla seleccionada no es válida.");
      setLoading(false);
      return;
    }

    if (
      !appliedStartDate ||
      !appliedEndDate ||
      appliedEndDate < appliedStartDate
    ) {
      setError("El rango de fechas seleccionado no es válido.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [vaultData, movements] = await Promise.all([
        fetchVault(id),
        fetchMovements(id, appliedStartDate, appliedEndDate),
      ]);

      setVault(vaultData);
      setMoveList(movements);
    } catch (err: any) {
      console.error("Error loading movements:", err);

      if (err.status === 403) {
        setError("No tienes acceso a esta cajilla.");
      } else if (err.status === 404) {
        setError("La cajilla no fue encontrada.");
      } else {
        setError("No fue posible cargar la información de la cajilla.");
      }
    } finally {
      setLoading(false);
    }
  }, [vaultId, appliedStartDate, appliedEndDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilter = () => {
    if (!startDate || !endDate || endDate < startDate) {
      return;
    }

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setAppliedMovementType(movementType);
  };

  const handleVaultsBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Botón volver */}
      <button
        onClick={handleVaultsBack}
        className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
      >
        ← Volver a cajillas
      </button>

      {/* Loading */}
      {loading && <Loading message="Cargando información de la cajilla..." />}

      {/* Error */}
      {!loading && error && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
          <p className="text-red-500">{error}</p>

          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {/* Contenido */}
      {!loading && !error && vault && (
        <>
          {/* Información */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500">
              {vault.store_name}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {vault.name}
            </h1>

            <p className="mt-2 text-gray-500">
              Consulta el saldo actual y los movimientos registrados.
            </p>
          </div>

          {/* Saldo */}
          <section className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Saldo actual
                </p>

                <p className="mt-2 text-4xl font-bold text-gray-900">
                  {formatCurrency(vault.balance)}
                </p>
              </div>

              <button
                onClick={handleAddMov}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
              >
                + Agregar movimiento
              </button>
            </div>
          </section>

          {/* Movimientos */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Movimientos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Historial de movimientos registrados en esta cajilla.
              </p>

              {/* Filters */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Filtrar movimientos
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecciona los criterios de búsqueda.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  {/* Fecha inicial */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Fecha inicial
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      max={endDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Fecha final */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Fecha final
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Tipo de movimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tipo de movimiento
                    </label>

                    <select
                      value={movementType}
                      onChange={(e) =>
                        setMovementType(e.target.value as MovementType)
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="all">Todos</option>
                      <option value="income">Ingresos</option>
                      <option value="expense">Egresos</option>
                    </select>
                  </div>

                  {/* Botón filtrar */}
                  <button
                    onClick={handleFilter}
                    disabled={
                      loading ||
                      !startDate ||
                      !endDate ||
                      endDate < startDate ||
                      (startDate === appliedStartDate &&
                        endDate === appliedEndDate &&
                        movementType === appliedMovementType)
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Filtrar
                  </button>
                </div>
              </div>
            </div>

            {/* Sin movimientos */}
            {filteredMovements.length === 0 && (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">📋</div>

                <h3 className="font-semibold text-gray-800">
                  No hay movimientos para este filtro
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Intenta seleccionar otro tipo de movimiento.
                </p>
              </div>
            )}

            {/* Lista */}
            {filteredMovements.length > 0 && (
              <div className="divide-y divide-gray-100">
                {filteredMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {movement.detail}
                      </p>

                      <div className="mt-1 flex flex-col sm:flex-row sm:gap-3 text-sm text-gray-500">
                        <span>{formatDate(movement.created_at)}</span>

                        <span>Registrado por {movement.user_name}</span>
                      </div>
                    </div>

                    <div
                      className={`text-lg font-semibold ${
                        movement.amount < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(movement.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

const getCurrentMonthRange = () => {
  const today = new Date();

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay),
  };
};

export default MovementsPage;

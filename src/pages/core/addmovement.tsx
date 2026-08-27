import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createMovement } from "../../api/server";

function AddMovementPage() {
  const navigate = useNavigate();
  const { vaultId } = useParams();

  const [movementType, setMovementType] = useState<"ingreso" | "egreso">(
    "ingreso",
  );

  const [detail, setDetail] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [amountRaw, setAmountRaw] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatThousands = (value: string) =>
    value
      .replace(/\./g, "")
      .replace(/[^0-9]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");

    setAmountRaw(digits ? parseInt(digits) : null);
    setAmountDisplay(formatThousands(digits));
  };

  const finalAmount =
    amountRaw !== null
      ? movementType === "egreso"
        ? -amountRaw
        : amountRaw
      : null;

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!detail.trim()) {
      setError("Debes ingresar un detalle para el movimiento.");
      return;
    }

    if (finalAmount === null || amountRaw === 0) {
      setError("Debes ingresar un monto válido.");
      return;
    }

    if (!categoryId) {
      setError("Debes seleccionar una categoría.");
      return;
    }

    if (!vaultId || !Number(vaultId)) {
      setError("La cajilla seleccionada no es válida.");
      return;
    }

    const payload = {
      detail: detail.trim(),
      amount: finalAmount,
      amount_category_id: Number(categoryId),
      vault_id: Number(vaultId),
    };

    try {
      setIsSubmitting(true);

      await createMovement(payload);

      navigate(`/movimientos/${vaultId}`);
    } catch (err) {
      console.error("Error al guardar:", err);

      setError("No fue posible guardar el movimiento. Intenta nuevamente.");
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
        ← Volver a movimientos
      </button>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo movimiento</h1>

        <p className="mt-2 text-gray-500">
          Registra un ingreso o egreso en la cajilla seleccionada.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
      >
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Tipo de movimiento */}
        <div className="mb-6">
          <label className="block mb-3 text-sm font-semibold text-gray-800">
            Tipo de movimiento
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMovementType("ingreso")}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition ${
                movementType === "ingreso"
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              ↓ Ingreso
            </button>

            <button
              type="button"
              onClick={() => setMovementType("egreso")}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition ${
                movementType === "egreso"
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              ↑ Egreso
            </button>
          </div>
        </div>

        {/* Detalle */}
        <div className="mb-5">
          <label
            htmlFor="detail"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Detalle
          </label>

          <input
            id="detail"
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Ej: Pago de proveedor"
          />
        </div>

        {/* Monto */}
        <div className="mb-5">
          <label
            htmlFor="amount"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Monto
          </label>

          <div className="relative">
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold ${
                movementType === "ingreso" ? "text-blue-600" : "text-red-600"
              }`}
            >
              {movementType === "ingreso" ? "+" : "−"} $
            </span>

            <input
              id="amount"
              type="text"
              inputMode="numeric"
              value={amountDisplay}
              onChange={handleAmountChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="100.000"
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="mb-8">
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-semibold text-gray-800"
          >
            Categoría
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>

            <option value="1">Salario</option>
            <option value="2">Arriendo</option>
            <option value="3">Servicios</option>
            <option value="4">Alimentación</option>
            <option value="5">Transporte</option>
            <option value="6">Otro</option>
          </select>
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
            {isSubmitting ? "Guardando..." : "Guardar movimiento"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMovementPage;

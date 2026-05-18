import { useState } from "react";
import { useNavigate } from "react-router";
import { createMovement } from "../api/server"; // función que crearás

function AddMovementPage() {
  const navigate = useNavigate();
  const [movementType, setMovementType] = useState<"ingreso" | "egreso">(
    "ingreso",
  );
  const [detail, setDetail] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [amountRaw, setAmountRaw] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatThousands = (val: string) =>
    val
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

  const amountPreview =
    finalAmount !== null
      ? (finalAmount > 0 ? "+" : "") +
        finalAmount.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        })
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || finalAmount === null || !categoryId) return;

    const payload = {
      detail,
      amount: finalAmount,
      amount_category_id: parseInt(categoryId),
      vault_id: 1,
      user_id: 1,
    };

    try {
      setIsSubmitting(true);
      await createMovement(payload); // POST al back
      navigate("/movimientos"); // vuelve a la lista → el useEffect la refresca
    } catch (err) {
      console.error("Error al guardar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full"
      >
        <h1 className="text-2xl font-bold mb-6">Nuevo movimiento</h1>

        {/* Tipo de movimiento */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setMovementType("ingreso")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              movementType === "ingreso"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            ↓ Ingreso
          </button>
          <button
            type="button"
            onClick={() => setMovementType("egreso")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              movementType === "egreso"
                ? "border-red-400 bg-red-50 text-red-500"
                : "border-gray-200 text-gray-400"
            }`}
          >
            ↑ Egreso
          </button>
        </div>

        {/* Detalle */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Detalle</label>
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Pago de arriendo"
          />
        </div>

        {/* Monto */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Monto</label>
          <div className="relative flex items-center">
            <span
              className={`absolute left-3 text-sm font-medium pointer-events-none ${
                movementType === "ingreso" ? "text-blue-500" : "text-red-500"
              }`}
            >
              {movementType === "ingreso" ? "+" : "−"}
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amountDisplay}
              onChange={handleAmountChange}
              className="w-full border rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100.000"
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>
              Seleccionar...
            </option>
            <option value="1">Salario</option>
            <option value="2">Arriendo</option>
            <option value="3">Servicios</option>
            <option value="4">Alimentación</option>
            <option value="5">Transporte</option>
            <option value="6">Otro</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export default AddMovementPage;

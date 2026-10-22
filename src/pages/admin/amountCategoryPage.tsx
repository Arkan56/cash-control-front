import { useCallback, useEffect, useState } from "react";
import { createAmountCategory, fetchAmountGategory } from "../../api/server";

interface AmountCategory {
  id: number;
  description: string;
}

function AmountCategoryPage() {
  const [categories, setCategories] = useState<AmountCategory[]>([]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchAmountGategory();
      setCategories(data);
    } catch (err) {
      console.error("Error al cargar las categorías:", err);
      setError("No fue posible cargar las categorías.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedDescription = description.trim();

    setError(null);
    setSuccess(null);

    if (!trimmedDescription) {
      setError("Debes ingresar el nombre de la categoría.");
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.description.toLocaleLowerCase() ===
        trimmedDescription.toLocaleLowerCase(),
    );

    if (alreadyExists) {
      setError("Ya existe una categoría con ese nombre.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createAmountCategory({
        description: trimmedDescription,
      });

      setDescription("");
      setSuccess("La categoría se creó correctamente.");

      await loadCategories();
    } catch (err) {
      console.error("Error al crear la categoría:", err);
      setError("No fue posible crear la categoría. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Categorías de movimientos
        </h1>

        <p className="mt-2 text-gray-500">
          Administra las categorías utilizadas para clasificar los ingresos y
          egresos de caja.
        </p>
      </div>

      {/* Formulario */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Nueva categoría
        </h2>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Nombre de la categoría
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
                setSuccess(null);
              }}
              maxLength={100}
              disabled={isSubmitting}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Crear categoría"}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}
        </form>
      </section>

      {/* Categorías existentes */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Categorías registradas
          </h2>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {categories.length}
          </span>
        </div>

        {isLoading ? (
          <p className="p-6 text-sm text-gray-500">Cargando categorías...</p>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-gray-700">
              No hay categorías registradas
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Crea una categoría para comenzar a clasificar los movimientos.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-3 px-6 py-4 transition hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 5h16" />
                    <path d="M4 12h16" />
                    <path d="M4 19h16" />
                    <circle cx="8" cy="5" r="1" />
                    <circle cx="14" cy="12" r="1" />
                    <circle cx="10" cy="19" r="1" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {category.description}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  Registrada
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AmountCategoryPage;

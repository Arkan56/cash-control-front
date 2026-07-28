import React, { useState } from "react";
import { createUser } from "../../api/server";
import { useNavigate } from "react-router";

function CreateUserPage() {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !name || !password) return;

    const payload = {
      user_name: userName,
      name,
      password,
    };

    try {
      await createUser(payload);
      navigate("/admin");
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full"
        >
          <h1 className="text-2xl font-bold mb-6">Crear Usuario</h1>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Usuario</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Contraseña</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Guardar
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateUserPage;

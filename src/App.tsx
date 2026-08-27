import AddMovementPage from "./pages/core/addmovement";
import MovementsPage from "./pages/core/movements";
import { BrowserRouter, Routes, Route } from "react-router";
import VaultsPage from "./pages/core/vaults";
import StoresPage from "./pages/core/stores";

import AdminDashboardPage from "./pages/admin/dashboard";
import CreateStorePage from "./pages/admin/createStore";
import CreateVaultPage from "./pages/admin/createVault";
import CreateUserPage from "./pages/admin/createUser";
import UserDetailPage from "./pages/admin/userDetail";
import UsersPage from "./pages/admin/users";

import LoginPage from "./pages/auth/login";

import { RequireRol } from "./components/requireRol";
import { ROLES } from "./constants/roles";

import MainLayout from "./layouts/MainLayout";
import AdminStoreDetailPage from "./pages/admin/storeDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          element={
            <RequireRol rolesPermitidos={[ROLES.ADMIN, ROLES.WORKER]}>
              <MainLayout />
            </RequireRol>
          }
        >
          <Route path="movimientos/:vaultId" element={<MovementsPage />} />

          <Route
            path="añadir-movimiento/:vaultId"
            element={<AddMovementPage />}
          />

          <Route path="cajillas/:storeId" element={<VaultsPage />} />

          <Route path="tiendas" element={<StoresPage />} />
        </Route>

        <Route
          path="admin"
          element={
            <RequireRol rolesPermitidos={[ROLES.ADMIN]}>
              <MainLayout />
            </RequireRol>
          }
        >
          <Route index element={<AdminDashboardPage />} />

          <Route path="crear-local" element={<CreateStorePage />} />

          <Route path="crear-cajilla" element={<CreateVaultPage />} />

          <Route path="crear-usuario" element={<CreateUserPage />} />

          <Route path="usuarios" element={<UsersPage />} />

          <Route path="usuarios/:userId" element={<UserDetailPage />} />
          <Route
            path="/admin/locales/:storeId"
            element={<AdminStoreDetailPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

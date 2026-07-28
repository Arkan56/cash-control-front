import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { decodeToken } from "../api/auth";
import { getToken } from "../api/cliente";

export const RequireRol = ({
  rolesPermitidos,
  children,
}: {
  rolesPermitidos: number[];
  children: ReactNode;
}) => {
  const token = getToken();
  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = decodeToken(token);
    if (!rolesPermitidos.includes(payload.user_rol_id)) {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

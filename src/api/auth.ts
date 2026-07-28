import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  user_id: number;
  user_name: string;
  user_rol_id: number;
  exp: number;
};

export const decodeToken = (token: string): JwtPayload => {
  return jwtDecode<JwtPayload>(token);
};
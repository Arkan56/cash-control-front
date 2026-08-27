export const ROLES = {
  ADMIN: 1,
  WORKER: 2,
} as const;

export const getRoleName = (roleId: number) => {
  switch (roleId) {
    case ROLES.ADMIN:
      return "Administrador";

    case ROLES.WORKER:
      return "Operario";

    default:
      return "Usuario";
  }
};

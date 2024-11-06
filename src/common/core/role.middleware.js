export const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    /*  const { permissions } = req.user || {};
    const hasPermission = requiredPermissions.some((requiredPermission) =>
      permissions?.includes(requiredPermission)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "No autorizado" });
    } */

    next();
  };
};

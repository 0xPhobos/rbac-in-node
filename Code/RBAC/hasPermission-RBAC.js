const hasPermission = (action) => {
  return async (req, res, next) => {
    const { user } = req.body;
    const { asset } = req.params;
    const userRoles = resolveUserRoles(user);

    const allowed = await userRoles.reduce(async (perms, role) => {
      const acc = await perms;
      if (acc) return true;

      const can = await policy.can(role, action, asset);
      if (can) return true;
    }, false);

    allowed ? next() : res.status(403).send("Forbidden").end();
  };
};

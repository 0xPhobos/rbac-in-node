const hasPermission = (action) => {
  return (req, res, next) => {
    const { user } = req.body;
    const { asset } = req.params;
    const userRoles = resolveUserRoles(user);

    const permissions = userRoles.reduce((perms, role) => {
      perms =
        roles[role] && roles[role][action]
          ? perms.concat(roles[role][action])
          : perms.concat([]);
      return perms;
    }, []);

    const allowed = permissions.includes(asset);

    allowed ? next() : res.status(403).send("Forbidden").end();
  };
};

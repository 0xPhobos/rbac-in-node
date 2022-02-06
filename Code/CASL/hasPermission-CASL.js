const hasPermission = (action) => {
  return (req, res, next) => {
    const { user } = req.body;
    const { asset: assetId } = req.params;
    const ability = defineRulesFor(user);
    const asset = new Resource(assetId);
    try {
      ForbiddenError.from(ability).throwUnlessCan(action, asset);
      next();
    } catch (error) {
      res.status(403).send("Forbidden").end();
    }
  };
};

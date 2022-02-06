const { is } = require("express-jwt-aserto");

const options = {
  authorizerServiceUrl: "https://authorizer.prod.aserto.com",
  policyId: process.env.POLICY_ID,
  authorizerApiKey: process.env.AUTHORIZER_API_KEY,
  tenantId: process.env.TENANT_ID,
  policyRoot: process.env.POLICY_ROOT,
  useAuthorizationHeader: false,
};

const hasPermission = (action) => {
  return async (req, res, next) => {
    const { user } = req.body;
    const { asset } = req.params;
    req.user = { sub: user.id };
    const allowed = await is("allowed", req, options, false, { asset });
    allowed ? next() : res.status(403).send("Forbidden").end();
  };
};

const users = require("./users");
const resolveUserRole = (user) => {
  //Would query DB
  const userWithRole = users.find((u) => u.id === user.id);
  return userWithRole.role;
};

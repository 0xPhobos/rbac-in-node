const grantList = [
  { role: "evilGenius", asset: "megaSeeds", action: "delete:any" },
  { role: "evilGenius", asset: "timeCrystals", action: "delete:any" },
  {
    role: "evilGenius",
    asset: "megaSeeds",
    action: "read:any",
  },
  { role: "editor", asset: "megaSeeds", action: "update:any" },
  { role: "editor", asset: "timeCrystals", action: "update:any" },
  {
    role: "editor",
    asset: "megaSeeds",
    action: "read:any",
    attributes: ["*", "!id"],
  },
  { role: "user", asset: "megaSeeds", action: "read:any" },
  { role: "user", asset: "timeCrystals", action: "read:any" },
];

module.exports = grantList;

const dotenv = require("dotenv");
dotenv.config();

const sqliteRuntime = require("@prisma/orm-sqlite/runtime");
const sqliteStatic = require("@prisma/orm-sqlite/static");
const contract = require("./contract.json");

const contractValue = sqliteStatic.contractFromJson(contract);
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const databasePath = databaseUrl.replace(/^file:/, "");

const db = sqliteRuntime.default({
  contract: contractValue,
  path: databasePath,
});

module.exports = { db };
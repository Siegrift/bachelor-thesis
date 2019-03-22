// NOTE: this file is re-exporting './config' as js module, so we can run migrations using knex cli
require("ts-node/register");
module.exports = require("./src/db/config").default;

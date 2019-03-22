exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table
      .uuid("id")
      .notNullable()
      .primary();
    table
      .string("name")
      .notNullable()
      .unique();
    table.string("password").notNullable();
    table.boolean("isAdmin").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};

exports.up = function(knex) {
  return knex.schema.createTable("user", table => {
    table
      .uuid("id")
      .notNullable()
      .primary();
    table
      .string("name")
      .notNullable()
      .unique();
    table.string("password").notNullable();
    table.boolean("is_admin").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("user");
};

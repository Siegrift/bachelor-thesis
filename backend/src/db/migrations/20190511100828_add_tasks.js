exports.up = function(knex) {
  return knex.schema.createTable("task", table => {
    table
      .uuid("id")
      .notNullable()
      .primary();
    table
      .string("name")
      .notNullable()
      .unique();
    table
      .uuid("group_id")
      .references("id")
      .inTable("group")
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("task");
};

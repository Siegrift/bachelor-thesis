exports.up = function(knex) {
  return knex.schema.createTable("submit", table => {
    table
      .uuid("id")
      .notNullable()
      .primary();
    table
      .uuid("task_id")
      .references("id")
      .inTable("task")
      .notNullable();
    table
      .uuid("user_id")
      .references("id")
      .inTable("user")
      .notNullable();
    table.string("result").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("submit");
};

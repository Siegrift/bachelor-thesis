// https://github.com/tgriesser/knex/issues/938

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("group", table => {
      table
        .uuid("id")
        .notNullable()
        .primary();
      table
        .string("name")
        .notNullable()
        .unique();
    })
    .createTable("user_group", table => {
      table
        .uuid("id")
        .notNullable()
        .primary();
      table
        .uuid("group_id")
        .references("id")
        .inTable("group")
        .notNullable()
        .onDelete("cascade");
      table
        .uuid("user_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("cascade");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("group").dropTable("user_group");
};

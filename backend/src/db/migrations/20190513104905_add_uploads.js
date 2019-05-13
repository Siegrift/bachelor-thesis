exports.up = function(knex) {
  return knex.schema
    .createTable("upload", table => {
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
      table.timestamp("created_at").notNullable();
      table.string("name").notNullable();
      table.boolean("is_autosave").notNullable();
    })
    .then(() => {
      // NOTE: this migration will remove all submits in db!
      return knex("submit")
        .delete()
        .then(() => {
          return knex.schema.alterTable("submit", table => {
            table
              .uuid("upload_id")
              .references("id")
              .inTable("upload")
              .notNullable();
          });
        });
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("upload").then(() => {
    knex.schema.table("submit", table => {
      table.dropColumn("upload_id");
    });
  });
};

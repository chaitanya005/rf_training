exports.up = function(knex, promise) {
    return knex.schema.createTable('user_info', (table)=>{
        table.increments('id').primary();
       table.string('name', 255).notNullable();
       table.string('username', 255).notNullable();
       table.string('email', 255).notNullable();
       table.string('password', 255).notNullable();
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable("user_info");
};
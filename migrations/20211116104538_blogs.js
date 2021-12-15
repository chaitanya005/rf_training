
exports.up = function(knex) {
    return knex.schema.createTable('blogs', (table)=>{
        table.increments('id');
       table.string('title', 255).notNullable();
       table.string('content', 500).notNullable();
       table.string('image', 100000).notNullable();
       table.integer('user_id').notNullable();
       table.string('posted_by').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("blogs");
};

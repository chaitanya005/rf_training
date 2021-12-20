
exports.up = function(knex) {
    return knex.schema.createTable('likes', (table)=>{
        table.increments('id');
        table.integer('blog_id').notNullable();
        table.integer('heart').notNullable();
        table.integer('reacted_by_id').notNullable();
        table.string('reacted_by').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("likes");
};

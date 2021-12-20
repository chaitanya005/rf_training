
exports.up = function(knex) {
    return knex.schema.createTable('comments', (table)=>{
        table.increments('id');
        table.integer('blog_id').notNullable();
        table.string('comment').notNullable();
        table.string('posted_by').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("comments");
};

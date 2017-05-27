module.exports = {
    selectSingle: function(table, option = null) {
        sql = 'SELECT ';

        if (typeof option.fields !== 'undefined')
        {
            for (var i = 0; i < option.fields.length; i++) {

            }
        }
        else {
            sql += '* ';
        }

        `SELECT teachers.id,first_name,last_name,phone,email,current_courses 
        FROM teachers,users
        WHERE teachers.id = users.id
        order by last_name asc 
        LIMIT 5 offset 5`
    },
};

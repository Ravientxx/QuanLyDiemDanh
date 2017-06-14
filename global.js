module.exports = {
    db: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'qldd'
    },
    host : 'localhost:4200',
    role: {
        admin: 0,
        student: 1,
        teacher: 2,
        staff: 3,
    },
    absence_request_status: {
        new: 0,
        accepted: 1,
        rejected: 2
    },

    jwt_secret_key : '13530191353049',
    jwt_expire_time : '1d',
    jwt_reset_password_expire_time : 30 * 60,

    default_page: 1,
    default_limit: 10,

    lecturer_role: 0,
    ta_role: 1,

    api_ver: 1,
    
    sendError: function(res, detail = null, message = "Server error") {
        res.send({ result: 'failure', detail: detail, message: message });
    },

    filterListByPage: function(page, limit, list) {
        var result = [];
        var length = list.length;
        if (length < limit) {
            return list;
        } else {
            if (page * limit > length) {
                for (var i = (page - 1) * limit; i < length; i++) {
                    result.push(list[i]);
                }
            } else {
                for (var i = (page - 1) * limit; i < page * limit; i++) {
                    result.push(list[i]);
                }
            }
            return result;
        }
    },

    sortListByKey: function(order, list, key) {
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list.length; j++) {
                var value1 = list[i][key].toString().toLowerCase();
                var value2 = list[j][key].toString().toLowerCase();
                if (order == 'dsc' && value1 > value2 || order == 'asc' && value1 < value2) {
                    var temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;
                }
            }
        }
    },
    getFirstName: function(name){
        var i = name.lastIndexOf(' ');
        var first_name = name.substr(0, i);
        return first_name;
    }, 
    getLastName: function(name){
        var i = name.lastIndexOf(' ');
        var last_name = name.substr(i + 1, name.length - 1);
        return last_name;
    },
};

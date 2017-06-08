module.exports = {
    db: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'qldd'
    },

    role: {
        student: 1,
        teacher: 2,
        staff: 3,
    },

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

    jwt_secret_key : '13530191353049',
    jwt_expire_time : '1d',

    default_page: 1,
    default_limit: 10,

    lecturer_role: 0,
    ta_role: 1,

    api_ver: 1,
};

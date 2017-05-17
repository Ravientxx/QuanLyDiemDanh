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

    sortListByName: function(sort, list) {
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list.length; j++) {
                if (sort == 'dsc' && list[i].last_name.toLowerCase() > list[j].last_name.toLowerCase() || sort == 'asc' && list[i].last_name.toLowerCase() < list[j].last_name.toLowerCase()) {
                    var temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;
                }
            }
        }
    },

    default_page: 1,
    default_limit: 10,

    api_ver: 1,
};

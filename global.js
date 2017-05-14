module.exports = {
	db : {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'qldd'
	},

    sendError: function(res, detail = null, message = "Server error") {
        res.send({ result: 'failure', detail: detail, message: message });
    },

    filterListByPage: function (page, limit, list) {
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

    default_page: 1,
    default_limit: 10,
};

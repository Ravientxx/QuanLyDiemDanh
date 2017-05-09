module.exports = {
	db : {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'qldd'
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
    }
};

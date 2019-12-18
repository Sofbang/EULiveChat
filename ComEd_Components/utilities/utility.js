let moment = require('moment')

function utility(){
    this.dateFormat = function(date,format){
        let d = moment(date).format(format);
        return d;
    }
}

module.exports = utility;
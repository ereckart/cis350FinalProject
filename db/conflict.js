var mongo = require('./mongo');

module.exports = {

    //adds the conflict to the database
    addConflict: function (conflictData, callback) {
        var conflict = new mongo.Conflict(conflictData);
        conflict.save(function (error) {
            if(error) {
                console.log(error)
            }
            callback(error);
            console.log('got to save function');
        });
    }
    
}
const Module = require ('./Module');

function DB() {
    Module.call(this);

}

DB.prototype = Object.create(Module.prototype);
DB.prototype.constructor = DB;

module.exports = DB;
const Module = require ('./Module');

function Service() {
    Module.call(this);
    this.update 	  = update;

}

Service.prototype = Object.create(Module.prototype);
Service.prototype.constructor = Service;

module.exports = Service;
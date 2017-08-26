const Module = require ('./Module');

function Service() {
    Module.call(this);

}

Service.prototype = Object.create(Module.prototype);
Service.prototype.constructor = Service;

module.exports = Service;
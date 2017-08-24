const Module = require ('./Module');

function Controller() {
    Module.call(this);

}

Controller.prototype = Object.create(Module.prototype);
Controller.prototype.constructor = Controller;

module.exports = Controller;
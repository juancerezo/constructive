const Module = require ('./Module');

function Dispatcher() {
    Module.call(this);

}

Dispatcher.prototype = Object.create(Module.prototype);
Dispatcher.prototype.constructor = Dispatcher;

module.exports = Dispatcher;
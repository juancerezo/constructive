const Module = require ('./Module');

function Model() {
    Module.call(this);
    
}

Model.prototype = Object.create(Module.prototype);
Model.prototype.constructor = Model;

module.exports = Model;
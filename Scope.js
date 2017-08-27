function Scope () {
    var __$$unloadModules = new Array;
    this.update = update;
    this.add    = add;

    function update () {

        while(__$$unloadModules.length > 0) {
            let _module = __$$unloadModules.pop();
            this[_module[0]] = _module [1];
        }
        
        delete this.update, this.add;
        return true;
    }
    
    function add (_module) {
        if (_module instanceof Array && _module.length === 2) {
            if (typeof _module[0] === 'string') {
                __$$unloadModules.push(_module);
            } else {
                throw new Error('Invalid type, not string at _module[0]');
            }
        } else {
            throw new Error('Invalid type, not array or lenght !== 2');
        }
        
        return true;
    }
}

Scope.prototype.constructor = Scope;
module.exports = Scope;
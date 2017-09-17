export default class Scope {
    constructor() {
        this.__unload_modules__ = new Array();

    }

    add (component) {
        if (component instanceof Array && component.length === 2) {

            if (typeof component[0] === 'string') {
                this.__unload_modules__.push(component);
            } else {
                throw new Error('Invalid type, not string at _module[0]');
            }
           
        } else {
            throw new Error('Invalid type, not array or lenght !== 2');
        }
    }

    update () {
        while(this.__unload_modules__.length > 0) {
            let component = this.__unload_modules__.pop();
            this[component[0]] = component[1];
        }

        delete this.update, this.add, this.__unload_modules__;
        return true;
    }
}
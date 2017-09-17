const Promise = require('bluebird');

export default class Component {
    constructor() {
        this.__name__   = new String();
        this.__scope__  = new Object();
        this.__store__  = new Object();
        this._init      = defaultInit;
        // this.value      = value; 

        function defaultInit() {
            delete this.init, this._init, this.__scope__, this.__store__;
            return new Promise((r) => {r();});
        }
    }

    import(dependencies) {
        this.__scope__ = new Object(dependencies);
        this.__name__  = this.constructor.name;
        delete this.import;
        return true;
    }

    store(data) {
        this.__store__ = new Object(data);
        delete this.store;
        return true;
    }

    init(initFunction) {
        this._init = () => {
            delete this._init, this.__scope__, this.__store__;
            return new Promise(initFunction).bind(this);
        };
        delete this.init;
        return true;
    }

    methods(methods) {
        this.graft(methods, true);
        delete this.methods;
        return true;
    }

    graft(graft, unsave) {
        if (!unsave) {
            //ToDo: check collisions
        }

        for (let key in graft) {
            this[key] = graft[key];
        }

        return true;
    }

}
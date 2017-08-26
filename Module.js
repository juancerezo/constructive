const Promise = require('bluebird');
const Application = require('./Application');

function Module () {
	this.__$$name	  = new String();
	this.__$$scope    = new Object();
	this.__$$store    = new Object();
	this.__$$init	  = defaultInit;
	
	function defaultInit () {
		delete this.init, this.__$$init, this.__$$scope, this.__$$store;
		return new Promise((r)=>{r()});
	}
}

Module.prototype.constructor = Module;

Module.prototype.import = function (dependencies) {
	this.__$$scope = new Object(dependencies);
	this.__$$name  = arguments.callee.caller.name;
	delete this.import;
	return true;
};

Module.prototype.store = function (data) {
	this.__$$store = new Object(data);
	delete this.store;
	return true;
};

Module.prototype.init = function (initFunction) {
	this.__$$init = () => {
		delete this.__$$init, this.__$$scope, this.__$$store;
		return new Promise(initFunction).bind(this)
	};
	delete this.init;
	return true;
};

Module.prototype.methods = function (methods) {
	this.graft(methods, true);
	delete this.methods;
	return true;
};

Module.prototype.graft = function (graft, unsave) {
	if (!unsave) {
		//ToDo: check collisions
	}
	for (let _key in graft) {
		this[_key] = graft[_key];
	}

	return true;
};

module.exports = Module;


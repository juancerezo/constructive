'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');

var Component = function () {
    function Component() {
        _classCallCheck(this, Component);

        this.__name__ = new String();
        this.__scope__ = new Object();
        this.__store__ = new Object();
        this._init = defaultInit;
        // this.value      = value; 

        function defaultInit() {
            delete this.init, this._init, this.__scope__, this.__store__;
            return new Promise(function (r) {
                r();
            });
        }
    }

    _createClass(Component, [{
        key: 'import',
        value: function _import(dependencies) {
            this.__scope__ = new Object(dependencies);
            this.__name__ = this.constructor.name;
            delete this.import;
            return true;
        }
    }, {
        key: 'store',
        value: function store(data) {
            this.__store__ = new Object(data);
            delete this.store;
            return true;
        }
    }, {
        key: 'init',
        value: function init(initFunction) {
            var _this = this;

            this._init = function () {
                delete _this._init, _this.__scope__, _this.__store__;
                return new Promise(initFunction).bind(_this);
            };
            delete this.init;
            return true;
        }
    }, {
        key: 'methods',
        value: function methods(_methods) {
            this.graft(_methods, true);
            delete this.methods;
            return true;
        }
    }, {
        key: 'graft',
        value: function graft(_graft, unsave) {
            if (!unsave) {
                //ToDo: check collisions
            }

            for (var key in _graft) {
                this[key] = _graft[key];
            }

            return true;
        }
    }]);

    return Component;
}();

exports.default = Component;
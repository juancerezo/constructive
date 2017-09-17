'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scope = function () {
    function Scope() {
        _classCallCheck(this, Scope);

        this.__unload_modules__ = new Array();
    }

    _createClass(Scope, [{
        key: 'add',
        value: function add(component) {
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
    }, {
        key: 'update',
        value: function update() {
            while (this.__unload_modules__.length > 0) {
                var component = this.__unload_modules__.pop();
                this[component[0]] = component[1];
            }

            delete this.update, this.add, this.__unload_modules__;
            return true;
        }
    }]);

    return Scope;
}();

exports.default = Scope;
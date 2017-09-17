'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scope = require('./scope');

var _scope2 = _interopRequireDefault(_scope);

var _db = require('../components/db');

var _db2 = _interopRequireDefault(_db);

var _service = require('../components/service');

var _service2 = _interopRequireDefault(_service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');

//Import components classes for check heritance

var Application = function () {
    function Application() {
        _classCallCheck(this, Application);

        this.__npm__ = new Object();
        this.__loaded_components__ = new Object();
        this.__imported_components__ = new Array();
        this.__startup_priority__ = new Array();
    }

    _createClass(Application, [{
        key: 'import',
        value: function _import(modules) {
            if (this.__imported_components__.length > 0) {
                return true;
            } else {
                this.__imported_components__ = modules;
                return true;
            }
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            var ApplicationInit = function ApplicationInit(resolve, reject) {
                var i = _this.__imported_components__.length;
                var services = new Object();

                while (i > 0) {
                    i--;
                    var component = new _this.__imported_components__[i](null, null);
                    var dependencies = component.__scope__;
                    var $store = component.__store__;
                    var $scope = new _scope2.default();
                    var _unloadDepts = new Array();
                    var component_name = component.__name__;

                    for (var key in dependencies) {
                        var dept = dependencies[key];

                        if (component instanceof _db2.default || key === 'npm') {

                            for (var _key in dependencies.npm) {
                                dept = dependencies.npm[_key];
                                var npm_module = _this.__npm__[dept];
                                if (!npm_module) npm_module = require(dept);
                                $scope.add([_key, npm_module]);
                            }if (component instanceof _db2.default) break;
                        } else {

                            if (_this.__loaded_components__[dept]) {
                                $scope.add([key, _this.__loaded_components__[dept]]);
                            } else if (component instanceof _service2.default) {
                                _unloadDepts.push([key, dept]);
                            } else {
                                reject(new Error('Inconsistent dependency. (' + dept + ' is required but not yet loaded)'));
                            }
                        }
                    }

                    _this.__loaded_components__[component_name] = new _this.__imported_components__[i]($scope, $store);
                    _this.__startup_priority__.push(component_name);

                    if (component instanceof _service2.default) {
                        services[component_name] = {
                            component: _this.__loaded_components__[component_name],
                            depts: _unloadDepts,
                            $scope: $scope
                        };
                    } else {
                        $scope.update();
                    }
                }

                for (var service in services) {
                    service = services[service];

                    var _i = 0;
                    while (_i < service.depts.length) {
                        var _dept = service.depts[_i];

                        if (services[_dept[1]]) {
                            //ToDo: Check Collisions
                            service.$scope.add([_dept[0], services[_dept[1]].module]);
                        } else {
                            reject(new Error('Inconsistent dependency. (unknow depencency: ' + _dept[1] + ' )'));
                        }
                        _i++;
                    }

                    service.$scope.update();
                }

                resolve(true);
            };

            return new Promise(ApplicationInit).bind(this);
        }
    }, {
        key: 'start',
        value: function start() {
            var components = new Array();
            var i = 0;

            while (i < this.__startup_priority__.length) {
                var component_name = this.__startup_priority__[i];
                components.push(this.__loaded_components__[component_name]._init());
                i++;
            }

            return Promise.each(components, function () {});
        }
    }]);

    return Application;
}();

exports.default = Application;
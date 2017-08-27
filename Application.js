const Promise = require('bluebird');

const Scope   = require('./Scope');
const DB      = require('./DB');
const Service = require('./Service');

function Application () {
    this.__$$npm     = new Object();
    this.__$$modules = new Object();
    this.__$$import  = new Array();
    this.__$$startup = new Array();
}

Application.prototype.constructor = Application;

Application.prototype.import = function (modulesArray) {
    if (this.__$$import.length > 0) {
        return true;
    } else {
        this.__$$import = modulesArray;
        return true;
    }
};

Application.prototype.init = function () {
    var self = this;
    return new Promise(_ApplicationInit);

    function _ApplicationInit (resolve, reject) {

        let i = self.__$$import.length;
        let services = {};
    
        while(i > 0) {
            i--;
            let _module       = new self.__$$import[i](false, false);
            let _dependencies = _module.__$$scope;
            let $scope        = new Scope();
            let $store        = _module.__$$store;
            let _unloadDepts   = new Array();

            for (let key in _dependencies) {
                if (_module instanceof DB || key === 'npm') {
                    for (let key in _dependencies.npm) {
                        if (self.__$$npm[_dependencies.npm[key]]) {
                            $scope.add([key, self.__$$npm[_dependencies.npm[key]]]);
                        } else {
                            self.__$$npm[_dependencies.npm[key]] = require(_dependencies.npm[key]);
                            $scope.add([key, self.__$$npm[_dependencies.npm[key]]]);
                        }
                    } if(_module instanceof DB) break;

                } else {
                    if (self.__$$modules[_dependencies[key]]) {
                        $scope.add([key, self.__$$modules[_dependencies[key]]]);
                    } else if (_module instanceof Service) {
                        _unloadDepts.push([key , _dependencies[key]]);
                    } else {
                        reject(new Error('Inconsistent dependency. ('+ _dependencies[key] +' is required but is not yet loaded)'));
                    }
                }
            }
    
            self.__$$modules[_module.__$$name] = new self.__$$import[i]($scope, $store);
            self.__$$startup.push(_module.__$$name);

            if (_module instanceof Service) {
                services[_module.__$$name] = {
                    $depts: _unloadDepts, 
                    $scope: $scope,
                    $module: self.__$$modules[_module.__$$name]
                }
            } else {
                $scope.update();
            }
        }

        for (let service in services) {
            service = services[service];

            let i = 0;
            while(i < service.$depts.length) {
                
                let dept = service.$depts[i];
                if (services[dept[1]]) {
                    //ToDo: Check Collisions
                    service.$scope.add([dept[0], services[dept[1]].$module]);
                } else {
                    reject(new Error('Inconsistent dependency. (unknow depencency: ' + dept[1] + ' )'));
                }
                i++;
            }
          
            service.$scope.update();
        }
       
        resolve(true);
    }
};


Application.prototype.start = function () {
    let modules = new Array();
    let i = 0;
    
    while(i < this.__$$startup.length) {
        modules.push(this.__$$modules[this.__$$startup[i]].__$$init());
        i++;
    }

    return Promise.each(modules, function() {});
};

module.exports = Application;
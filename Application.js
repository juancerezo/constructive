const Promise = require('bluebird');

const DB = require('./DB');

function Application () {
    this.__$$npm     = new Object();
    this.__$$modules = new Object();
    this.__$$import  = new Array();
    this.__$$startup = new Array();
}

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
    
        while(i > 0) {
            i--;
            let _module       = new self.__$$import[i](false, false);
            let _dependencies = _module.__$$scope
            let $scope        = new Object();
            let $store        = _module.__$$store;
    
            if (_module instanceof DB) {
                _dependencies = _dependencies.npm;
                for (let key in _dependencies) {
                    if (self.__$$npm[_dependencies[key]]) {
                        $scope[key] = self.__$$npm[_dependencies[key]];
                    } else {
                        self.__$$npm[_dependencies[key]] = require(_dependencies[key]);
                        $scope[key] = self.__$$npm[_dependencies[key]];
                    }
                }
            } else {
                for (let key in _dependencies) {
                    if (key === 'npm') {
                        for (let key in _dependencies.npm) {
                            if (self.__$$npm[_dependencies.npm[key]]) {
                                $scope[key] = self.__$$npm[_dependencies.npm[key]];
                            } else {
                                self.__$$npm[_dependencies.npm[key]] = require(_dependencies.npm[key]);
                                $scope[key] = self.__$$npm[_dependencies.npm[key]];
                            }
                        }
                    } else {
                        if (self.__$$modules[_dependencies[key]]) {
                            $scope[key] = self.__$$modules[_dependencies[key]];
                        } else {
                            reject(new Error('Inconsistent dependency. ('+ _dependencies[key] +' is required but is not yet loaded)'));
                        }
                    }
                }
            }

            self.__$$modules[_module.__$$name] = new self.__$$import[i]($scope, $store);
            self.__$$startup.push(_module.__$$name);
        }
        
        resolve(true);
    }
};


Application.prototype.start = function () {
    let modules = new Array();
    let i = 0;
    console.log('Constructive-Application: Starting modules...');
    while(i < this.__$$startup.length) {
        modules.push(this.__$$modules[this.__$$startup[i]].__$$init());
        i++;
    }

    return Promise.each(modules, function() {});
};

module.exports = Application;

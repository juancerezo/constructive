const Promise = require('bluebird');
import Scope from './scope';

//Import components classes for check heritance
import DB       from '../components/db';
import Service  from '../components/service'; 

export default class Application {
    constructor() {
        this.__npm__                 = new Object();
        this.__loaded_components__   = new Object();
        this.__imported_components__ = new Array();
        this.__startup_priority__    = new Array();
    }

    import(modules) {
        if (this.__imported_components__.length > 0) {
            return true;
        } else {
            this.__imported_components__ = modules;
            return true;
        }
    }

    init() {
        let ApplicationInit = (resolve, reject) => {
            let i = this.__imported_components__.length;
            let services = new Object();

            while(i > 0) {
                i--;
                let component       = new this.__imported_components__[i](null, null);
                let dependencies    = component.__scope__;
                let $store          = component.__store__;
                let $scope          = new Scope();
                let _unloadDepts    = new Array();
                let component_name  = component.__name__;

                for (let key in dependencies) {
                    let dept = dependencies[key];

                    if (component instanceof DB || key === 'npm') {

                        for (let key in dependencies.npm) {
                            dept = dependencies.npm[key];
                            let npm_module = this.__npm__[dept];
                            if (!npm_module) npm_module = require(dept);
                            $scope.add([key, npm_module]);
                        } if (component instanceof DB ) break;

                    } else {

                        if (this.__loaded_components__[dept]) {
                            $scope.add([key, this.__loaded_components__[dept]]);
                        } else if (component instanceof Service) {
                            _unloadDepts.push([key, dept]);
                        } else {
                            reject(new Error('Inconsistent dependency. ('+ dept +' is required but not yet loaded)'));
                        }
                    }
                }

                this.__loaded_components__[component_name] = new this.__imported_components__[i]($scope, $store);
                this.__startup_priority__.push(component_name);

                if (component instanceof Service) {
                    services[component_name] = {
                        component: this.__loaded_components__[component_name],
                        depts:  _unloadDepts,
                        $scope:     $scope
                    };
                } else {
                    $scope.update();
                }
            }

            for (let service in services) {
                service = services[service];

                let i = 0;
                while(i < service.depts.length) {
                    let dept = service.depts[i];
                    
                    if (services[dept[1]]) {
                        //ToDo: Check Collisions
                        service.$scope.add([dept[0], services[dept[1]].module]);
                    } else {
                        reject(new Error('Inconsistent dependency. (unknow depencency: ' + dept[1] + ' )'));
                    }
                    i++;
                }

                service.$scope.update();
            }

            resolve(true);
        };

        return new Promise(ApplicationInit).bind(this);
    }

    start() {
        let components = new Array();
        let i = 0;

        while (i < this.__startup_priority__.length) {
            let component_name = this.__startup_priority__[i];
            components.push(this.__loaded_components__[component_name]._init());
            i++;
        }

        return Promise.each(components, () => {});
    }
}
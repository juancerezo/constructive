const Module = require ('./Module');

function Service() {
    Module.call(this);
    this.update 	  = update;
	
	var __dyn$scope;

	function update ($scope) {
		if ($scope) {
			__dyn$scope = $scope;
		} else {
			delete this.update;
			return __dyn$scope;
		}
	}

}

Service.prototype = Object.create(Module.prototype);
Service.prototype.constructor = Service;

module.exports = Service;
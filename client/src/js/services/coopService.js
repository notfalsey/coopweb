'use strict';

var appName = 'coopApp';
angular.module(appName)
.factory(appName + '.coopService', ['$http', '$log', '$interval', function($http, $log, $interval) {

	var baseUrl = 'https://192.168.1.111:9443/coop';

	var commandDoor = function(dir, callback) {
		$http.put(baseUrl + '/door', {
			dir: dir
		})
		.success(function(data, status, headers, config) {
			callback(null, data);
		})
		.error(function(data, status, headers, config) {
			$log.error('Error sending door command dir = ' +dir+', status=' + status + ': ' + data);
            callback(new Error(data));
		});
	};

	var reset = function(dir, callback) {
		$http.put(baseUrl + '/reset', {})
		.success(function(data, status, headers, config) {
			callback(null, data);
		})
		.error(function(data, status, headers, config) {
			$log.error('Error sending door command dir = ' +dir+', status=' + status + ': ' + data);
            callback(new Error(data));
		});
	};

	var getCoopData = function(valueName, callback) {
		$http.get(baseUrl + '/' + valueName, {
		})
		.success(function(data, status, headers, config) {
			callback(null, data);
		})
		.error(function(data, status, headers, config) {
			$log.error('Error getting coop data ('+valueName+'), status=' + status + ': ' + data);
            callback(new Error(data));
		});
	};

	var getDoorState = function(callback) {
		getCoopData('door', callback);
	};

	var getUptime = function(callback) {
		getCoopData('uptime', callback);
	};

	var getLight = function(callback) {
		getCoopData('light', callback);
	};

	var getTemp = function(callback) {
		getCoopData('temp', callback);
	};

	var getClosingTime = function(callback) {
		getCoopData('closetime', callback);
	};

	var getOpeningTime = function(callback) {
		getCoopData('opentime', callback);
	};

	var getCoopData = function(valueName, callback) {
		$http.get(baseUrl + '/' + valueName, {
		})
		.success(function(data, status, headers, config) {
			callback(null, data);
		})
		.error(function(data, status, headers, config) {
			$log.error('Error getting coop data ('+valueName+'), status=' + status + ': ' + data);
            callback(new Error(data));
		});
	};

	return {
		commandDoor: commandDoor,
		getClosingTime: getClosingTime,
		getDoorState: getDoorState,
		getLight: getLight,
		getOpeningTime: getOpeningTime,
		getTemp: getTemp,
		getUptime: getUptime,
		reset: reset
	}
}]);
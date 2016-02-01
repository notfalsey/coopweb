var i2c = require('i2c'),
	log = require('./logger.js')();

function CoopController(config) {
	this.address = 0x05;
	this.wire = new i2c(config.i2cAddress, {device: '/dev/i2c-1', debug: false}); // point to your i2c address, debug provides REPL interface
	this.messageInProgress = false;
}

CoopController.prototype = {
	sendCommand: function(command, args, callback) {
		var self = this;
		if(!self.messageInProgress) {
			self.messageInProgress = true;
			self.wire.writeBytes(command, args, function(err) {
				if(err) {
					var msg = 'Error writing data to i2c bus';
					log.error({command: command, args: args, err: err}, msg);
					self.messageInProgress = false;
					callback(new Error(msg));
				} else {
					setTimeout(function() {
						wire.read(4, function(err, readBytes) {
							self.messageInProgress = false;
							if(err) {
								var msg = 'Error reading data from i2c bus';
								log.error({command: command, args: args, err: err}, msg);
								callback(new Error(msg));
							} else {
								var reading = (readBytes[0]<<24) + (readBytes[1]<<16) + (readBytes[2]<<8) + readBytes[3];
								log.debug({command: command, args: args, readBytes: readBytes, reading: reading}, 'Read data from i2c bus');
								callback(null, reading);
							}
						});
					}, 50);
				}
			});	
		} else {
			var msg = 'Error: i2c message in progress';
			log.error({command: command, args: args}, msg);
			callback(new Error(msg));
		}
	},
	echo: function(args, callback) {
		sendCommand(0, args, callback);
	},
	reset: function(callback) {
		sendCommand(1, [], callback);
	},
	readTemp: function(callback) {
		sendCommand(2, [], callback);
	},
	readLight: function(callback) {
		sendCommand(3, [], callback);
	},
	readDoor: function(callback) {
		sendCommand(4, [], callback);
	},
	closeDoor: function(callback) {
		sendCommand(5, [], callback);
	},
	openDoor: function(callback) {
		sendCommand(6, [], callback);
	},
	autoDoor: function(callback) {
		sendCommand(7, [], callback);
	},
	upTime: function(callback) {
		sendCommand(8, [], callback);
	}
};

module.exports = CoopController;
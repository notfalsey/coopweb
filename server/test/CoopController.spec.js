'use strict';

var assert = require('assert'),
    Promise = require('bluebird'),
    sinon = require('sinon-as-promised')(Promise),
    CoopController = require('../src/CoopController.js');

describe('CoopController', () => {
    var testSunset = {
        hour: 18,
        minute: 30
    };

    var testSunrise = {
        hour: 5,
        minute: 45
    };

    var mockNotifyService = {};
    var config = {
        enableNotify: true,
        latitude: 35,
        longitude: -79
    };

    it('should initialize properly', () => {
        var mockI2c = function() {
            return {
                writeBytes: function(command, args) {
                    return Promise.resolve();
                },
                read: function(numBytes) {
                    var response = [0, 0, 0, 0];
                    return Promise.resolve(response);
                }
            };
        };
        var coopController = new CoopController(config, mockNotifyService, mockI2c);
        var now = new Date();
        assert(coopController.getClosingTime() > coopController.getOpeningTime());
        assert.equal(coopController.isClosing(), false);
        assert.equal(coopController.isOpening(), false);
        assert.equal(coopController.getReadErrorCount(), 0);
        assert.equal(coopController.getWriteErrorCount(), 0);
        assert.equal(coopController.getAutoResetCount(), 0);
        assert.equal(coopController.getLastSuccessfulRead(), -1);
        assert.equal(coopController.getLastSuccessfulWrite(), -1);
        assert.equal(coopController.getLastError(), -1);
        assert.equal(coopController.getLongestUptime(), 0);
        assert.equal(coopController.readDoor(), -1);
        assert.equal(coopController.readTemp(), -1);
        assert.equal(coopController.readMode(), -1);
        assert.equal(coopController.readUptime(), -1);
        assert.equal(coopController.readLight(), -1);
        assert.equal(coopController.readTemp(), -1);
    });

    it('closeDoor should send close door command successfully', () => {
        class mockI2c {
            writeBytes(command, args, callback) {
                callback();
            }
            read(numBytes, callback) {
                var response = [0, 0, 0, 2];
                callback(null, response);
            }
        }
        var coopController = new CoopController(config, mockNotifyService, mockI2c);
        return coopController.closeDoor().then((data) => {
            assert.equal(data, 2);
            assert.equal(coopController.readDoor(), 2);
        });
    });

    it('openDoor should send open door command successfully', () => {
        class mockI2c {
            writeBytes(command, args, callback) {
                callback();
            }
            read(numBytes, callback) {
                var response = [0, 0, 0, 0];
                callback(null, response);
            }
        }
        var coopController = new CoopController(config, mockNotifyService, mockI2c);
        return coopController.openDoor().then((data) => {
            assert.equal(data, 0);
            assert.equal(coopController.readDoor(), 0);
        });
    });


    it('should record read errors', () => {
        class mockI2c {
            writeBytes(command, args, callback) {
                callback();
            }
            read(numBytes, callback) {
                callback(new Error('i2c bus error'));
            }
        }
        var coopController = new CoopController(config, mockNotifyService, mockI2c);
        return coopController.openDoor().then(() => {
            assert.fail('Expected open door command to return error');
        }).catch((err) => {
            assert(err);
            // it will run one iteration of the read loop (4 commands) before it gets to this command
            assert.equal(coopController.getReadErrorCount(), 5);
        });
    });

    it('should send echo command successfully', () => {
        class mockI2c {
            writeBytes(command, args, callback) {
                callback();
            }
            read(numBytes, callback) {
                var response = [0, 0, 0, 1];
                callback(null, response);
            }
        }
        var coopController = new CoopController(config, mockNotifyService, mockI2c);
        return coopController.echo('test').then((data) => {
            assert.equal(data, 1);
        });
    });

    it('should send reset command successfully', () => {
        class mockI2c {
            writeBytes(command, args, callback) {
                callback();
            }
            read(numBytes, callback) {
                var response = [0, 0, 0, 5];
                callback(null, response);
            }
        }
        var coopController = new CoopController(config, mockNotifyService, mockI2c);
        return coopController.reset().then((data) => {
            assert.equal(data, 5);
        });
    });

    it('should send auto door command successfully', () => {
        class mockI2c {
            writeBytes(command, args, callback) {
                callback();
            }
            read(numBytes, callback) {
                var response = [0, 0, 0, 7];
                callback(null, response);
            }
        }
        var coopController = new CoopController(config, mockNotifyService, mockI2c);
        return coopController.autoDoor().then((data) => {
            assert.equal(data, 7);
        });
    });

});

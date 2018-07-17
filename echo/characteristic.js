var util = require('util');
var events = require('events');
var bleno = require('../..');

var BlenoCharacteristic = bleno.Characteristic;

var EchoCharacteristic = function(commandPacket) {
  EchoCharacteristic.super_.call(this, {
    uuid: 'dcda9e84-fd47-11e3-9751-b2227cce2b54',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this.commandPacket = commandPacket;
  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data, self = this;
  console.log(this._value);

  var machineId = parseInt(data[4].toString(16), 16);
  console.log("machineId: " + machineId); 
  var responseStatusArr = new Uint8Array([48, 50, 48, machineId, 48, 49, 49, 55, 50, 56, 48, 52, 52, 51, 48, 52, 50, 52, 196]);

  setInterval(function(){ 
    //Runtime Status of machine that will be send every 5 seconds.
    //self.commandPacket.sendRuntimeStatus(responseStatusArr, self); 
  }, 5000);

  //this.commandPacket.commandPacket(this._value.toString('hex'));
  if(this.commandPacket.isValidCommandPacket(this._value)){
     if(this._value[13] == 56 || this._value[13] == 52){
      this._updateValueCallback(new Uint8Array([132]));	
      responseStatusArr[1] = 49;
      this._updateValueCallback(responseStatusArr);	
     
      setTimeout(function() {
        console.log("----sending crossing action status----: ");
        responseStatusArr[1] = 50;
        self._updateValueCallback(new Uint8Array([132]));
        self._updateValueCallback(responseStatusArr);
      }, 5000);

    } else {
      console.log("General Status Command");
      this.commandPacket.commandPacket(this._value);
      console.log("Command Packet after evaluation ", this.commandPacket);
      this._updateValueCallback(new Uint8Array([131]));	
      this._updateValueCallback(new Uint8Array([48, 49, 48, machineId, 48, 49, 48, 48, 48, 66, 48, 49, 51, 49, 48, 49, 50, 57, 195]));	
    }
  } else {
    console.log("Invalid Command Packet");
  }

  //console.log('EchoCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));
  if (this._updateValueCallback) {
  console.log('EchoCharacteristic - onWriteRequest: notifying');
  // this.commandPacket.commandCrossingActionPacket(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

EchoCharacteristic.prototype.onSubscribe = function(data, updateValueCallback) {
  console.log('EchoCharacteristic - onSubscribe');
  this._updateValueCallback = updateValueCallback;
};

EchoCharacteristic.prototype.onUnsubscribe = function() {
  console.log('EchoCharacteristic - onUnsubscribe');
  clearInterval();
  this._updateValueCallback = null;
};

module.exports = EchoCharacteristic;

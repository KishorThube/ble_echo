/**
*Command Packets contain commands sent from the Controller App to the
Toca Target. Typically, commands are executed immediately upon
receipt and depending upon the specific command, may or may not
result in a corresponding Response Packet sent from the TT back to
the Controller Application program. Valid text
characters are restricted to the 16 Hex text characters 0..9 and
A..F.
*/

var util = require('util');
var bleno = require('../..');

var sof = {
    NONE: 0,
    COMMAND: 82,
    RESPONSE: 83,
    STATUS: 84
};

var eof = {
    NONE: 0,
    COMMAND: 190,
    RESPONSE: 191,
    STATUS: 192
};

var crossingAction = {
    NULL: 0,
    REVERT_TO_PREVIOUS_LED_STATE: 4,
    SWITCH_TO_LEDS_OFF: 8
};

var validCommandPacketSof = 130;
var validCommandPacketEof = 194;

var validResponsePacketSof = 131;
var validResponsePacketEof = 195;

var validStatusPacketSof = 132;
var validStatusPacketEof = 196;

function Packet() {
  //Command packet definition spec
  this.sof = sof.NONE;
  this.eof = eof.NONE;
  this.commandDescriptor = null;
  this.machineId = null;
  this.sideSelector= null;
  this.commandSubtype= null;
  this.newStateSide= null;
  this.newStateColor= null;
  this.crossingAction= null;
  this.repeat= null;
  this.duration= null;
  this.ledColor= null;
};

Packet.prototype.commandPacket = function(buffer) {
        //console.log("Inside commandPacket buffer ", buffer);  
        if(buffer.length == 20){
            for (var i = 0, l = buffer.length; i < l; i++) {
            //console.log( i + " " + buffer[i]);
            }
            this.sof = buffer[0];
            this.eof = buffer[19];
            this.commandDescriptor = buffer[2];
            this.machineId = buffer[4];
            this.sideSelector = buffer[5];
            this.commandSubtype = buffer[6];
            //this.ledColor = parseInt((buffer[7] +  buffer[8] + buffer[9] + buffer[10] + buffer[11] + buffer[12]).toString(16), 16);
            this.crossingAction = buffer[13];
            this.repeat = buffer[14];
            this.duration = buffer[15] + "" + buffer[16];
        } else {
            console.log("Invalid Packet length");
        }
    
        console.log("Command Packet: ", this);
        return this;
};

Packet.prototype.commandCrossingActionPacket = function(buffer) {
    console.log("Inside commandCrossingActionPacket", buffer);
        
    for (var i = 0, l = buffer.length; i < l; i++) {
        console.log(buffer[i]);
    }
    console.log( i + " " + buffer[i]);
    this.sof = buffer[0];
    this.eof = buffer[19];
    this.commandDescriptor = buffer[2];
    this.machineId = buffer[4];
    this.sideSelector = buffer[5];
    this.commandSubtype = buffer[6];
    //this.ledColor = parseInt((buffer[7] +  buffer[8] + buffer[9] + buffer[10] + buffer[11] + buffer[12]).toString(16), 16);
    this.newStateSide = buffer[5];
    this.newStateColor = buffer[6];
    this.crossingAction = buffer[13];
    this.repeat = buffer[14];
    this.duration = buffer[15] + "" + buffer[16];

    /*this.sof = parseInt((buffer[0] + buffer[1] + "").toString(16), 16);
    this.eof = parseInt((buffer[18]+ buffer[19] + "").toString(16), 16);
    this.commandDescriptor = parseInt(buffer[2].toString(16), 16);
    this.machineId = parseInt(buffer[4].toString(16), 16);
    this.sideSelector = parseInt(buffer[5].toString(16), 16);
    this.commandSubtype = parseInt(buffer[6].toString(16), 16);
    this.ledColor = parseInt(("" + buffer[7] +  buffer[8] + buffer[9] + buffer[10] + buffer[11] + buffer[12]).toString(16), 16);
    this.newStateSide = parseInt(buffer[5].toString(16), 16);
    this.newStateColor = parseInt(buffer[6].toString(16), 16);
    this.crossingAction = parseInt(buffer[13].toString(16), 16);buffer[13];
    this.repeat = parseInt(buffer[14].toString(16), 16);buffer[14];
    this.duration = parseInt((buffer[15] + buffer[16] + "").toString(16), 16);*/

    console.log("Crossing action command: ", this);
    return this;
};

Packet.prototype.isValidCommandPacket = function(buffer){
    if (buffer[0] === validCommandPacketSof && buffer[19] === validCommandPacketEof ){
      return true;
    }
    else{
      return false;
    }
};

Packet.prototype.isValidResponsePacket = function(buffer){
    if (buffer[0] === validResponsePacketSof && buffer[19] === validResponsePacketEof ){
      return true;
    }
    else{
      return false;
    }
};

Packet.prototype.isValidStatusPacket = function(buffer){
    if (buffer[0] === validStatusPacketSof && buffer[19] === validStatusPacketEof ){
      return true;
    }
    else{
      return false;
    }
};

Packet.prototype.sendRuntimeStatus = function(responseStatusArr,self){
    setTimeout(function(){  
        //code goes here that will be run every 5 seconds.  
        responseStatusArr[1] = 49;
        if(self._updateValueCallback){
            self._updateValueCallback(new Uint8Array([132]));
            self._updateValueCallback(responseStatusArr);
            console.log("Sent Runtime Status:", responseStatusArr);    
        }
      }, 60000);
};

module.exports.Packet = Packet;
module.exports.sof = sof;
module.exports.eof = eof;
module.exports.crossingAction = crossingAction;
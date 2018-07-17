var bleno = require('../..');

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic');

var packet = require('./packet');

var Packet = new packet.Packet();

console.log('bleno - echo');

//
//A name to advertise our Target Service.
//
var name = 'TOCA T2 ID:9999';

//
//A name to advertise our Target Service from command line process.argv
//
if(process.argv[2]){
	name = process.argv[2];
}

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(name, ['582f2d98-fc9e-11e3-846a-b2227cce2b54']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: '582f2d98-fc9e-11e3-846a-b2227cce2b54',
        characteristics: [
          new EchoCharacteristic(Packet)
        ]
      })
    ]);
  }
});

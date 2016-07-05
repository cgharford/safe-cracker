var util = require('util');
var bleno = require('../index');

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;

var openDoorServiceUuid = 'FFE0';
var openDoorCharUuid = 'FFE1';
var openSafeServiceUuid = 'FFF0';
var openSafeCharUuid = 'FFF1';

console.log('bleno');

var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var openDoor = new Characteristic({ 
	uuid: openDoorCharUuid,
        properties: ['notify', 'read'],
	secure: ['notify', 'read'],
        value: null, 
	onSubscribe: function(maxValueSize, updateValueCallback) {
             console.log("inside on subsrcibe for door");

             const data = Buffer.from([02], 'binary');
	     console.log(data);
             updateValueCallback(data);
        },
	onNotify: function() {
	     //console.log("yo");
	}
});

var openSafe = new Characteristic({
        uuid: openSafeCharUuid,
	properties: ['notify', 'read'],
	secure: ['notify', 'read'],
        value: null,
        onReadRequest: function(offset, callback) {
            console.log("in read");
            // Puts the uptime into a buffer and updates the characteristic's values
        },
        onSubscribe: function(maxValueSize, updateValueCallback) {
             console.log("inside on subsrcibe for safe");
	     firstWait = setInterval(function(){
		  console.log("first we wait for 4 seconds");
		  var array = [128, 64, 32, 0];
	          var i = 0;
       		  myVar = setInterval(function(){
         	       console.log("this is the: " + i + "time through the loop");
              	       const data = Buffer.from([array[i]], 'binary');
                       console.log(data);
                       updateValueCallback(data);
                       if (i == 3) {
                           clearInterval(myVar);
                       }
                       i++;
             	  }, 1000);
		  /*for (i = 0; i < 4; i ++) {
   			data = Buffer.from([array[i]], 'binary');
                        console.log(data);
                        updateValueCallback(data);
		  }*/
		  clearInterval(firstWait);
	     }, 10000);
        },
	onNotify: function() {
             //console.log("yo");
        }

});


var openDoorService = new PrimaryService({
      uuid: openDoorServiceUuid,
      characteristics: [
           openDoor
      ]
});


var openSafeService = new PrimaryService({
      uuid: openSafeServiceUuid,
      characteristics: [
           openSafe
      ]
});

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state + ', address = ' + bleno.address);

     name = 'Jans Favorites';
     uuids = [openDoorServiceUuid, openSafeServiceUuid];
     if (state === 'poweredOn') {
        bleno.startAdvertising(name, uuids);
     } else {
        bleno.stopAdvertising();
    }
});

bleno.on('accept', function(clientAddress) {
     console.log('on -> accept, client: ' + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
  console.log('on -> disconnect, client: ' + clientAddress);
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    console.log("about to set services");
    bleno.setServices([
         openDoorService, openSafeService
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});

bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});

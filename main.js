var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName = process.argv[2];

var myPort = new SerialPort(portName,{
    baudRate:9600,
    parser:serialport.parsers.readline("\r\n")
})

myPort.on('open',onOpen);
myPort.on('data',onData);

function onOpen(){
    console.log("Open Connection");
}

function onData(data){
    console.log("On data "+data);
}
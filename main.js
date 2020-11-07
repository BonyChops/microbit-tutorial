let v = 0;

let gpioPort0, gpioPort2;
const controlLed = (v) => {
  let ledView = document.getElementById("ledView");
  ledView.style.backgroundColor = v === 1 ? "red" : "black";
  console.log(v);
  gpioPort0.write(v);
};

const mainFunction = () => {
  const connectButton = document.getElementById("connect");
  const onoff = document.getElementById("onoff");
  connectButton.onclick = connect;
  onoff.onmousedown = onLed;
  onoff.onmouseup = offLed;
};

const onLed = () => {
  controlLed(1);
};

const offLed = () => {
  controlLed(0);
};

const connect = async () => {
  const microBitBle = await microBitBleFactory.connect();
  const gpioAccess = await microBitBle.requestGPIOAccess();
  const mbGpioPorts = gpioAccess.ports;
   gpioPort0 = mbGpioPorts.get(0);
  gpioPort2 = mbGpioPorts.get(2);
  await gpioPort0.export("out");
  await gpioPort2.export("in");
  gpioPort2.onchange = toggleLed;
};

const readSwitchLoop = async() => {
  for(;;){
    let val = await gpioPort2.read();
    val = val === 0 ? 1 : 0;
    controlLed(val);
  }
}

const toggleLed = (val) => {
  console.log(val)
  controlLed(val === 0 ? 1 : 0);
}

window.onload = mainFunction;
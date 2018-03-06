const electron = require('electron');
const ipc = electron.ipcRenderer;
const path = require('path');
const axios = require('axios');
const BrowserWindow = electron.remote.BrowserWindow;

const notifyBtn = document.getElementById('notifyBtn');
notifyBtn.addEventListener('click', e => {
  const modalPath = path.join('file://', __dirname, 'add.html');
  let win = new BrowserWindow({
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    width: 400,
    height: 200
  });
  win.on('close', () => {
    win = null;
  });
  win.loadURL(modalPath);
  win.show();
});

var price = document.querySelector('h1');
var targetPriceVal;
var targetPrice = document.getElementById('targetPrice');

const notification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price!',
  icon: path.join(__dirname, '../assets/images/btc.png')
};

function getBTC() {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD').then(res => {
    const cryptos = res.data.BTC.USD;
    price.innerHTML = '$' + cryptos.toLocaleString('en');

    if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD) {
      const myNotification = new window.Notification(notification.title, notification);
      // myNotification.onclick = () => {
      //   console.log('clicked');
      // };
    }
  });
}
getBTC();
setInterval(getBTC, 30000);

ipc.on('targetPriceVal', function(event, arg) {
  targetPriceVal = Number(arg);
  targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en');
});

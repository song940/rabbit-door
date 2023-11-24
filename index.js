var client;

function MQTTconnect() {
  client = new Paho.MQTT.Client("mqtt.lsong.one", 8888, "clientId");
  return new Promise((resolve, reject) => {
    client.connect({
      onSuccess: resolve,
      onFailure: reject,
    });
  });
}

function sendMessage(message) {
  var message = new Paho.MQTT.Message(message);
  message.destinationName = "esp8266-relay2";
  client.send(message);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function oneClickUnlock() {
  sendMessage("relay1on"); // 发送接听指令
  await delay(1000);
  sendMessage("relay2on"); // 1秒后发送解锁指令
  await delay(1000);
  sendMessage("relay1off"); // 1秒后释放接听继电器
  sendMessage("relay2off"); // 同时释放解锁继电器
}

document.addEventListener("DOMContentLoaded", async function () {
  await MQTTconnect();
  document.getElementById("answer").addEventListener("click", function () {
    sendMessage("relay1on");
  });

  document.getElementById("unlock").addEventListener("click", function () {
    sendMessage("relay2on");
  });

  document.getElementById("oneClickUnlock").addEventListener("click", function () {
    oneClickUnlock();
  });
});

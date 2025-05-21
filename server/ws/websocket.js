import { WebSocketServer } from 'ws';
import Student from '../models/student.js';

let frontendClients = [];
let connectedDevices = {};
let pairedDevices = {};

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const isFrontend = req.url.includes('/frontend');
    const isDevice = !isFrontend;

    if (isFrontend) {
      frontendClients.push(ws);
      console.log('Frontend connected');
    } else {
      console.log('ESP32 device connected');
    }

    ws.on('message', async (msg) => {
      try {
        const message = msg.toString();
        const data = JSON.parse(message);
        console.log('Incoming WS message:', data);

        if (data.status === 'PAIRING_REQUEST') {
          const deviceId = data.device_id;
          connectedDevices[deviceId] = ws;
          console.log(`PAIRING_REQUEST from ${deviceId}`);

          frontendClients.forEach(client => {
            if (client.readyState === ws.OPEN) {
              client.send(JSON.stringify({ type: 'availableDevice', deviceId }));
            }
          });
        }

        if (data.type === 'PAIR_CONFIRM') {
          pairedDevices[data.deviceId] = ws;
          const deviceSocket = connectedDevices[data.deviceId];
          if (deviceSocket && deviceSocket.readyState === deviceSocket.OPEN) {
            deviceSocket.send(JSON.stringify({ status: 'PAIRED' }));
          }
        }

        if (data.type === 'DEPAIR') {
          delete pairedDevices[data.deviceId];
          console.log(`Device ${data.deviceId} depaired`);
        }

        if (data.event === 'RFID_SCAN') {
          const rollNo = data.rollNo || data.rfid;
          const deviceId = data.device_id;
          const student = await Student.findOne({ rollNo });

          if (!student) {
            console.log(`Student not found for ${rollNo}`);
            return;
          }

          frontendClients.forEach(client => {
            if (client.readyState === ws.OPEN) {
              client.send(JSON.stringify({
                type: 'rfidScan',
                rollNo,
                name: student.name,
                deviceId
              }));
            }
          });
        }
      } catch (err) {
        console.error('WebSocket error', err);
      }
    });

    ws.on('close', () => {
      if (isFrontend) {
        frontendClients = frontendClients.filter(c => c !== ws);
      } else {
        const deviceId = Object.keys(connectedDevices).find(key => connectedDevices[key] === ws);
        if (deviceId) delete connectedDevices[deviceId];
      }
    });
  });
};

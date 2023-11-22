import fs from 'node:fs/promises';
import { sendData, sendError } from "./send.js";
import { CLIENTS } from '../index.js';

export const handleAddClient = (req, res) => {
  let body = '';

  try {
    req.on('data', (chunk) => {
      body += chunk;
    });    
  } catch (error) {
    console.log('error: ', error);    
    sendError(res, 500, 'Ошибка сервера при чтении зароса');
  }

  req.on('end', async () => {
    try {      
      const newClient = JSON.parse(body);
      console.log('newClient: ', newClient);

      if (!newClient.fullName || !newClient.phone || !newClient.ticketNumber || !newClient.booking) {
        sendError(res, 400, 'Неверные основные данные клиента');
        return;
      }

      console.log(Array.isArray(newClient.booking));
      console.log(newClient.booking.every((item) => item.comedian && item.time));

      if (
          newClient.booking && 
          (!newClient.booking.length ||
            !Array.isArray(newClient.booking) ||
            !newClient.booking.every((item) => item.comedian && item.time))
        ) {
        sendError(res, 400, 'Неверно заполнено поля бронирования');
        return;
      }      
      
      const clientData = await fs.readFile(CLIENTS, 'utf-8');
      const clients = JSON.parse(clientData);
      clients.push(newClient);
      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, newClient);
    } catch (error) {
      console.error('error: ', error);      
    }
  });
};
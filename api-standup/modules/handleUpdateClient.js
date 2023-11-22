import fs from 'node:fs/promises';
import { sendData, sendError } from "./send.js";
import { CLIENTS } from '../index.js';

export const handleUpdateClient = (req, res, segments) => {
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
      const updateDataClient = JSON.parse(body);      
      const ticketNumber = segments[1];

      if (!updateDataClient.fullName || !updateDataClient.phone || !updateDataClient.ticketNumber || !updateDataClient.booking) {
        sendError(res, 400, 'Неверные основные данные клиента');
        return;
      }

      if (
        updateDataClient.booking &&
        (!updateDataClient.booking.length ||
          !Array.isArray(updateDataClient.booking) ||
          !updateDataClient.booking.every((item) => item.comedian && item.time))
      ) {
        sendError(res, 400, 'Неверно заполнено поля бронирования');
        return;
      }
      
      const clientData = await fs.readFile(CLIENTS, 'utf-8');
      const clients = JSON.parse(clientData);

      const clientIndex = clients.findIndex(c => c.ticketNumber === ticketNumber);

      if (clientIndex === -1) {
        sendError(res, 404, 'Клиент с данным номером билета не найден');
        return;
      }

      
      clients[clientIndex] = {
        ...clients[clientIndex], ...updateDataClient
      };

      //clients.push(newClient);
      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.error('error: ', error);
      sendError(res, 500, `Ошибка сервера: ${error}`);
    }
  });
};
import fs from 'node:fs/promises';
import { sendData, sendError } from "./send.js";
import { CLIENTS } from '../index.js';

export const handleClientsRequest = async (req, res, ticketNumber) => {
  try {
    const clientData = await fs.readFile(CLIENTS, 'utf-8');
    const clients = JSON.parse(clientData);

    const client = clients.find(c => c.ticketNumber === ticketNumber);
    console.log(client);
    console.log("ticketNumber", ticketNumber);
    if (!client) {
      sendError(res, 404, 'Клиент с данным номером билета отсутсвует');
      return;
    }

    sendData(res, client);
  } catch (error) {
    console.error(`Ошибка обработки запроса: ${error}`);
    sendError(res, 500, `Ошибка обработки запроса: ${error}`);
  }
};
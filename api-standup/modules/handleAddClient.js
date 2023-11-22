import fs from 'node:fs/promises';
import { sendData, sendError } from "./send.js";

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

  req.on('end', () => {
    try {      
      const newClient = JSON.parse(body);
      console.log('newClient: ', newClient);

      if (!newClient.fullName || !newClient.phone || !newClient.ticketNumber) {
        sendError(res, 400, 'Неверные основные данные клиента');
        return;
      }

      if (newClient.booking &&  
        (!Array.isArray(newClient.booking)) || 
          !newClient.booking.every((item) => item.comediant && item.time)
        ) {
          sendError(res, 400, 'Неверно заполнены поля бронирования');
          return;
      }

      
      sendData(res, newClient);
    } catch (error) {
      console.error('error: ', error);      
    }
  });

};
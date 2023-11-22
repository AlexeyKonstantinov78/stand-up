import http from 'node:http';
import fs from 'node:fs/promises';
import { checkFile } from './modules/checkFile.js';
import { sendError } from './modules/send.js';
import { handleComediantsRequest } from './modules/handleComediantsRequest.js';
import { handleAddClient } from './modules/handleAddClient.js';
import { handleClientsRequest } from './modules/handleClientsRequest.js';
import { handleUpdateClient } from './modules/handleUpdateClient.js';

const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async () => {
  if (!(await checkFile(COMEDIANS))) return;

  if (!(await checkFile(CLIENTS, true))) return;

  const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {         
      try {
        res.setHeader("Access-Control-Allow-Origin", '*'); // заголовок  по доступу        
        const segments = req.url.split('/').filter(Boolean); // фильтр boolean убирает пустые         
  
        // GET && comrdians/ id
        if (req.method === 'GET' && segments[0] === 'comedians') {          
          handleComediantsRequest(req, res, comedians, segments);
          return;          
        } 
  
        // добавление клиента POST / clients
        if (req.method === 'POST' && segments[0] === 'clients' )  {          
          handleAddClient(req, res);
          return; 
        }
  
        // Получение клиента по номеру билета GET/ clients / :ticket
        if (req.method === 'GET' && segments[0] === 'clients' && segments.length === 2) {
          const ticketNumber = segments[1];          
          handleClientsRequest(req, res, ticketNumber);
          return; 
        }
  
        // ОБновление клиента по номеру билета PATCH/ clients / :ticket
        if (req.method === 'PATCH' && segments[0] === 'clients' && segments.length === 2) {                   
          handleUpdateClient(req, res, segments);
          return; 
        }
        
        // not found        
        sendError(res, 404, 'Not found');        
      } catch (error) {
        sendError(res, 500, `Ошибка сервера: ${error.message}`);
      }      
    })
    .listen(PORT);
  
  console.log(`Сервер запущен http://localhost:${PORT}`);
};

startServer();

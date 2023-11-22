import http from 'node:http';
import fs from 'node:fs/promises';

const PORT = 8080;
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';

const checkFiles = async () => {
  try {
    await fs.access(COMEDIANS);
  } catch (error) {
    console.error(`File ${COMEDIANS} not fond`);
    return false;  
  }

  try {
    await fs.access(CLIENTS);
  } catch (error) {
    await fs.writeFile(CLIENTS, JSON.stringify([]));
    console.error(`Файл ${CLIENTS} был создан`);
    return false;
  }

  return true;
};

const sendData = (res, data) => {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": '*',
  });

  res.end(data);
};

const sendError = (res, statusCode, errMessage) => {
  res.writeHead(statusCode, {
    "Content-Type": "text/plan; charset=utf-8",
  });

  res.end(errMessage);
};

const startServer = async () => {
  if (!(await checkFiles())) return;

  http
    .createServer(async (req, res) => {         
      try {
        res.setHeader("Access-Control-Allow-Origin", '*'); // заголовок  по доступу
        console.log(req.url);
        const segments = req.url.split('/').filter(Boolean); // фильтр boolean убирает пустые 
        console.log('segments: ', segments);
  
        // GET && comrdians/ id
        if (req.method === 'GET' && segments[0] === 'comedians') {          
          const data = await fs.readFile(COMEDIANS, 'utf-8');
          
          if (segments.length === 2) {
            const comedian = JSON.parse(data).find((c) => c.id === segments[1]);

            if (!comedian) {
              sendError(res, 404, 'Stendup комик не найден');              
              return;
            }

            sendData(res, JSON.stringify(comedian));
            return;
          }
          
          sendData(res, data);
          return;          
        } 
  
        // добавление клиента POST / clients
        if (req.method === 'POST' && segments[0] === 'clients' )  {
  
        }
  
        // Получение клиента по номеру билета GET/ clients / :ticket
        if (req.method === 'GET' && segments[0] === 'clients' && segments.length === 2) {
  
        }
  
        // ОБновление клиента по номеру билета PATCH/ clients / :ticket
        if (req.method === 'PATCH' && segments[0] === 'clients' && segments.length === 2) {
  
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

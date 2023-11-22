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

const startServer = async () => {

  if (!(await checkFiles())) return;

  http
    .createServer(async (req, res) => {  
      if (req.method === 'GET' && req.url === '/comedians') {
        try {
          const data = await fs.readFile(COMEDIANS, 'utf-8');
          
          res.writeHead(200, {      
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": '*',
          });
          res.end(data);
        } catch (error) {
          res.writeHead('500', { 
            "Content-Type": "text/plain; charset=utf-8", 
          });
          res.end(`Ошибка сервера: ${error.message}`);
        }
      } else {
        res.writeHead(404, {
          "Content-Type": "text/html; charset=utf-8",
          "Access-Control-Allow-Origin": '*',
        });
        res.end("<h2>Not found</h2>");
      }
    })
    .listen(PORT);
  
  console.log(`Сервер запущен http://localhost:${PORT}`);
};

startServer();

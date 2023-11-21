import http from 'node:http';
import fs from 'node:fs/promises';

const PORT = 8080;
const fileName = 'comedians.json';

http
  .createServer(async (req, res) => {  
    if (req.method === 'GET' && req.url === '/comedians') {
      try {
        const data = await fs.readFile(fileName, 'utf-8');
        
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
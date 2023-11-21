import http from 'node:http';
import fs from 'node:fs/promises';

const data = await fs.readFile('package.json', "utf-8");
console.log('data: ', data);


const PORT = 8080;

http
  .createServer((req, res) => {
    res.writeHead(200, {      
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": '*',
    });
    res.end("<h1>Привет мир</h1>");

  })
  .listen(PORT);

console.log(`Сервер запущен http://localhost:${PORT}`);

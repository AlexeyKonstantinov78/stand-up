import http from 'node:http';

const PORT = 8080;

http
  .createServer((req, res) => {
    res.writeHead(200, {      
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.end("Привет мир");

  })
  .listen(PORT);

console.log(`Сервер запущен http://localhost:${PORT}`);

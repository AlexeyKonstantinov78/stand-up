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
      res.setHeader("Access-Control-Allow-Origin", '*'); // заголовок  по доступу
      console.log(req.url);
      const segments = req.url.split('/').filter(Boolean); // фильтр boolean убирает пустые 
      console.log('segments: ', segments);

      if (req.method === 'GET' && segments[0] === 'comedians') {
        try {
          const data = await fs.readFile(COMEDIANS, 'utf-8');
          
          if (segments.length === 2) {
            const comedian = JSON.parse(data).find((c) => c.id === segments[1]);

            if (!comedian) {
              res.writeHead(404, {
                "Content-Type": "text/html; charset=utf-8",
              });
              res.end("<h2>Stendup комик не найден</h2>");
              throw new Error('Standup undefaund'); 
              return;
            }

            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8",
            });
            res.end(JSON.stringify(comedian));
            return;
          }
          
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
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
        });
        res.end("<h2>Not found</h2>");
      }
    })
    .listen(PORT);
  
  console.log(`Сервер запущен http://localhost:${PORT}`);
};

startServer();

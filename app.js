import {readFile , writeFile} from 'fs/promises';
import { createServer} from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { appendFile } from 'fs/promises';

const PORT = process.env.PORT || 2000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const servefile = async (res , filepath, contentType)=>{
    try {
        const data = await readFile(filepath);
        res.writeHead(200,{'content-type' : contentType});
        res.end(data);
    } catch (error) {
        res.writeHead(400, {'content-type' : contentType});
        res.end('page is not found');
    }
}

const server = createServer((req,res)=>{
     if(req.method === 'GET'){
        if(req.url === "/")
            return servefile (res , path.join('public', 'index.html'), 'text/html');
     
        if(req.url === "/style.css")
            return servefile (res , path.join('public', 'style.css'), 'text/css');
     }
     if (req.method === 'POST' && req.url === '/submit') {
        let body = '';
    
        req.on('data', chunk => {
          body += chunk;
        });
    
        req.on('end', async () => {
          try {
            const { name, email } = JSON.parse(body);
    
            const newEntry = {
              name,
              email,
              time: new Date().toISOString()
            };
    
            await appendFile(path.join(__dirname, 'students.json'), JSON.stringify(newEntry) + '\n');
    
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Data saved for ${name}`);
          } catch (err) {
            console.error('Error in writing:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error saving data');
          }
        });
      }
    });




    server.listen(PORT, '0.0.0.0', () => {  
      console.log(`Server started at port ${PORT}`);
    });
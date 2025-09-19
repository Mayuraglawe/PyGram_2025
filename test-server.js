import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Test Server</title></head>
      <body>
        <h1>Server is Working!</h1>
        <p>If you can see this, the server is running correctly on port 8081</p>
        <p>Now try the main application at <a href="http://localhost:8080">http://localhost:8080</a></p>
      </body>
    </html>
  `);
});

server.listen(8081, () => {
  console.log('Test server running at http://localhost:8081/');
});
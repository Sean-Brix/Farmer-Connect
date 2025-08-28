import http from 'http';

console.log('=== BASIC SERVER STARTING ===');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  
  if (req.url === '/auth/is-authenticated') {
    res.end(JSON.stringify({ authenticated: false, message: 'Basic auth check' }));
  } else {
    res.end(JSON.stringify({ message: 'Basic server working!', timestamp: new Date() }));
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`✅ Basic server running on http://localhost:${PORT}`);
});

console.log('Basic server setup complete');

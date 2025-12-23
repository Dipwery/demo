const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // মূল ফর্ম দেখাও
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Save Text</title></head>
      <body>
        <h1>Enter text to save</h1>
        <input type="text" id="userInput" placeholder="Type something here"/>
        <button onclick="saveText()">Save</button>
        <p><a href="/data">See all saved data</a></p>
        <script>
          function saveText() {
            const text = document.getElementById('userInput').value;
            fetch('/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: 'userText=' + encodeURIComponent(text)
            })
            .then(res => res.text())
            .then(data => alert(data));
          }
        </script>
      </body>
      </html>
    `);
  } else if (req.method === 'POST' && req.url === '/') {
    // ইনপুট সেভ করো
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const params = new URLSearchParams(body);
      const userText = params.get('userText');

      fs.appendFileSync('data.txt', userText + '\n');

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Saved: ' + userText);
    });
  } else if (req.method === 'GET' && req.url === '/data') {
    // ফাইল পড়ে দেখাও
    let content = '';
    try {
      content = fs.readFileSync('data.txt', 'utf8');
    } catch (err) {
      content = 'No data saved yet!';
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Saved Data</title></head>
      <body>
        <h1>All Saved Entries</h1>
        <pre>${content}</pre>
        <p><a href="/">Go back</a></p>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
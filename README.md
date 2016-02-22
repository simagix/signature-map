# Signature Map

Signature Map is a socket.io app.  The node.js powered web server listens to a MQTT broker and updates the map accordingly.

### Keywords
    - socket.io
    - Node.js
    - MQTT

### Installation
```
npm install
```

### Start Web Server
```
npm start
```
The default port is 3001, http://localhost:3031.
  
### Docker Build
```
docker build -t signature-map .
```

### Docker Run
```
docker run -p 3001:3001 -d signature-map
    

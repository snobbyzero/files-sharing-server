const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const testConnection = require('./db/index').testConnection;
const createTables = require('./db/index').createTables;

testConnection();
createTables();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set('port', process.env.PORT || 3001);

app.use('/api/upload', require('./controllers/UploadFilesController'));
app.use('/api/files', require('./controllers/ReceiveFilesController'));

const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./server.crt')
};

https.createServer(httpsOptions, app).listen(443, () => {
    console.log("listening");
});

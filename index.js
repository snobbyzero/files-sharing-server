const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set('port', process.env.PORT || 3001);

app.use('/upload', require('./controllers/UploadFilesController'));

app.listen(app.get('port'), () => {
    console.log(`Listening server on http://127.0.0.1:3001`);
});

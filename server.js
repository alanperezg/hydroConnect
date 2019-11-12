let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/alexastats', (req, res) => {
    res.send({ph: 8, ce: 400, waterLevel: 80, lux: 1000, temp: 32});
});
app.listen(80, function () {});
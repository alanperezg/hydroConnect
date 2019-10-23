let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/test', (req, res) => {
    res.send(req.body);
    console.log(req.body);
});
app.listen(80, function () {});
// ******** Dependencies **********************************************
var express = require ('express'),
    rp = require('request-promise'),
    cons = require ('consolidate'),
    bodyParser = require ('body-parser');

var app = express();
var port = process.env.PORT || 3000;

/// ******** adding view engine ***************************************
app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// ******** public folder for static files ****************************
app.use(express.static('public'));

// ******** adding body-parser ****************************************
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// ********* Routes ***************************************************
app.get('/', (req, res)=>{
   res.render('home');
});

// Api consume
app.get('/:currency', (req, res) => {
    var currency  = req.params.currency;
    encodedCurr = encodeURIComponent(currency);

    rp({
        uri: `https://v3.exchangerate-api.com/bulk/d0fb1772c147c8a8d4bbf284/${encodedCurr}`,
        json: true
    })
        .then((data) => {

            res.render('curr', {'data':data});
        })
        .catch((err) => {
            console.log(err);
            res.render('error');
        });
});

// ******** Port listener ********************************************
app.listen(port, function () {
    console.log('server run in http://localhost:' + port)
});

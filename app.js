
var express=require('express');
var app= express();
var fs = require('fs'); 
var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();
var urlencodedParser= bodyParser.urlencoded({ extended: false});

// fs.readFile('./info.json', 'utf8', (err, jsonString) => {
//     if (err) {
//         console.log("Error reading file from disk:", err)
//         return
//     }
//     try {
//         var family= JSON.parse(jsonString)
//         console.log("Parent 1 is: ", family.parents.parent1) // => "Customer address is: Infinity Loop Drive"
//     } catch(err) {
//         console.log('Error parsing JSON string:', err)
//     }
// });

app.set('view engine', 'ejs');
var port = process.env.PORT || 3000;
app.use('/assets', express.static(__dirname +'/public'));
app.get('/', function(req, res) {
    res.render('index');
});
app.get('/aboutme', function(req, res) {
    res.render('aboutme');
});
app.get('/food', function(req, res) {
    res.render('food');
});
app.get('/contact', function(req, res) {
    res.render('contact');
});
app.get('/family', function(req, res) {
    res.render('family');
});
app.post('/contact', urlencodedParser,function(req, res){
    console.log(req.body.firstname);
    console.log(req.body.email);
    console.log(req.body.comment);
   
    res.send("recieved your request!");
 });
app.listen(port);




var express=require('express');
var app= express();
var fs = require('fs'); 
var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();
var urlencodedParser= bodyParser.urlencoded({ extended: false});
var famMems=require('./info.json');
var mysql=require('mysql');
// fs.readFile('./info.json', 'utf8', (err, jsonString) => 
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
app.use(express.static(__dirname +'/public'));
app.get('/', function(req, res) {
    console.log(famMems);
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
    res.render('family', {famMems:famMems}); 
    
});

app.post('/contact', urlencodedParser,function(req, res, next){
    var firstname=req.body.firstname;
    var email=req.body.email;
    var comment =req.body.comment;
    console.log(req.body)
    if(firstname==='' || email===''|| comment==='') {
        res.status(400)
        res.render('error','FAILED TO ADD TO DATABASE, missing valueERROR')

    } else {

        res.send("recieved your request!");
    }


    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"password",
        database:"sys"
    });
    con.connect();
    var qury = `INSERT INTO sys.contactform (comment, email, submission_date, firstname ) VALUES ( "${comment}", "${email}", CURDATE(), "${firstname}" )`;
    console.log(qury);
    con.query(qury, 
        function(err){
            if(err) {
                res.status(500)
                res.render('error','FAILED TO ADD TO DATABASE, MYSQL ERROR')

            }
            //console.log(rows[0]);
        }
    
    );

    con.end();
    next();
 });
 app.post('/family', urlencodedParser,function(req, res){
    var responseName= req.body.dropnames;
   console.log(responseName);
    res.redirect('/familydetail/'+responseName);
 });

 app.get('/familydetail/:responseName', function(req, res) {
    var responseName=req.params.responseName;
    var person= famMems.filter(item=>item.Name===responseName);
    console.log(person[0].Name);
    res.render('familydetail', {person:person[0]}); 
    
});
app.listen(port);



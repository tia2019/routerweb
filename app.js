
var express=require('express');
var app= express();
var fs = require('fs'); 
var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();
var urlencodedParser= bodyParser.urlencoded({ extended: false});
var webinfo=require('./info.json');
var multer = require('multer');
//var webinfo=JSON.parse(fs.readFileSync('/Users/tiaholmes/Documents/nodetraining/routingpractice/info.json', 'utf8'));
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

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/uploads");
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});


var upload = multer({ storage: Storage }).array("imgUploader", 1); 

app.get('/', function(req, res) {
   // console.log(famMems);
    res.render('index');
   // console.log("got Index")
   
});
app.get('/aboutme', function(req, res) {
    console.log(webinfo);
    res.render('aboutme', {info:webinfo});
    
});
// app.get('/food', function(req, res) {
//     res.render('food');

// });
app.get('/contact', function(req, res) {
    res.render('contact');

   
});
app.get('/family', function(req, res) {
    res.render('family', {info:webinfo}); 
    
});
app.get('/guestbook', function(req, res){
    console.log(req.body);
   

    var con = mysql.createConnection({
        host:"34.67.108.108",
        user:"root",
        password:"password",
        database:"formdata"
    });
    con.connect();
    var qury = `SELECT * FROM form `;
    console.log(qury);
    con.query(qury, 
        function(err, result){
            if(err) {
                res.status(500)
                res.render('error','FAILED TO FETCH FROM TO DATABASE, MYSQL ERROR')

            }
            console.log(result);
            res.render('guestbook',{myresult:result});
            //console.log(rows[0]);
        }
    
    );

    con.end()
});
app.get('/api/:pageName', function(req, res){
   // console.log(req.params.pageName);
    var pageName = req.params.pageName;
    var passme=webinfo[0].webinfo[pageName];
    res.json(passme);
    //var passme1 = [passme];
    //console.log(passme1);
    //res.render('api', {webinfo:passme1}); 

});

app.post('/contact', urlencodedParser, function(req, res){
    
    upload(req, res, function(err) {
        console.log(req);
        if (err) {
            return res.end("Something went wrong!");
        } else {
            var firstname=req.body.firstname;
            var email=req.body.email;
            var comment =req.body.comment;
            var fname=req.files[0].originalname;
           // console.log(req.files[0].originalname);
           // console.log(req.body)
            if(firstname==='' || email===''|| comment==='') {
                res.status(400)
                res.render('error','FAILED TO ADD TO DATABASE, missing valueERROR')

            } else {

                res.send("recieved your request!");
            }


            var con = mysql.createConnection({
                host:"34.67.108.108",
                user:"root",
                password:"password",
                database:"formdata"
            });
            con.connect();
            var qury = `INSERT INTO formdata.form (comment, email, submission_date, firstname, fname ) VALUES ( "${comment}", "${email}", CURDATE(), "${firstname}", "${fname}" )`;
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
            return res.end("File uploaded sucessfully!.");
        }
    });

    

 });
 app.post('/family', urlencodedParser,function(req, res){
    var responseName= req.body.dropnames;
   console.log(responseName);
    res.redirect('/familydetail/'+responseName);
 });

 app.get('/familydetail/:responseName', function(req, res) {
    var responseName=req.params.responseName;
   // var person= famMems.filter(item=>item.Name===responseName);
    console.log(responseName,);
    var person2= webinfo[0].webinfo.family[responseName];
    console.log(person2);
   // console.log(person2[0].Name);
    res.render('familydetail', {person2:person2, responseName:responseName}); 
    
});
app.listen(port);



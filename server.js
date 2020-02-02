var express = require("express");
var app = express(); // create an app
var itemList = []; // store items on this array
var ItemDB;
var messageDB;


/**********************************************
 * Configuration 
 **********************************************/

 // enable CORS

 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Rquested-With, Content-Type, Accept");
    next();
});

// config body-parse to read info in request
var bparser = require("body-parser");
app.use(bparser.json());

// to server static files (css, js, img, pdfs)
app.use(express.static( __dirname + '/public'));

var ejs = require('ejs');
app.set('views', __dirname + '/public'); // where are the HTML files?
app.engine('html', ejs.renderFile);
app.set('view engine', ejs);

// MongoDB connection config

var mongoose = require('mongoose');
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");
var db = mongoose.connection;

 /*********************************************
  * Web Server Enpoints
  *********************************************/

app.get('/', (req, res) =>{
    res.render('catalog.html');
});


// contact endpoint
app.get('/contact', (req, res) => {
    res.render('contact.html');
});

app.get('/exc/:message', (req, res) => {
    console.log("Message from client: ", req.params.message);
    
    var msj = req.params.message;
    var vowels = '';
    var allVowels = ['a', 'e', 'i', 'o', 'u'];

    for (var i=0; i<msj.length; i++){
        var letter = msj[i];
        console.log(letter);
        if (allVowels.indexOf(letter.toLowerCase()) != -1 &&
            vowels.indexOf(letter.toLowerCase()) == -1){
            
            vowels += letter;
        }
    }

    // return each vowel only once
    // hellooo -> eo
    // this is a test -> iae

    res.status(202);
    res.send(vowels);

});



/***********************************************
 * API END POINTS
 * 
 * Application Programming Interface
 ***********************************************/

 app.post('/api/items', (req, res) => {
    console.log("client wants to store items");

    var itemForMongo = ItemDB(req.body);
    itemForMongo.save(
        function(error, savedItem){
            if(error){
                console.log("**Error saving item", error);
                res.status(500); // internal server error
                res.send(error);
            }

            // no error:
            console.log("Item saved!!!!");
            res.status(201); // created
            res.json(savedItem);
        }
    )
    
 });

 app.post('/api/messages', (req, res) => {
    var messageForMongo = messageDB(req.body);
    messageForMongo.save( function(error, savedMessage){
        if(error){
            console.log("Error saving", error);
            res.status(500);
            res.send(error);
        }
        
        console.log("Message saved!");
        res.status(201);
        res.json(savedMessage);
    });
 });

 app.get('/api/messages', (req, res) => {
     messageDB.find({}, function(error, data){
        if(error){
            res.status(500);
            res.send(error);
        }

        res.status(200); // ok
        res.json(data);
     });
 });

 app.get('/api/items', (req, res) => {
     ItemDB.find({}, function(error, data){
        if(error){
            res.status(500);
            res.send(error);
        }

        res.status(200); // ok
        res.json(data);
     });
 });

 app.get('/api/items/:id', (req, res) => {
    var id = req.params.id;

    ItemDB.find({ _id: id}, function(error, item){
        if(error){
            res.status(404);
            res.send(error);
        }
        res.status(200);
        res.json(item);
    });
 });

 app.get('/api/items/byName/:name', (req, res) => {
    var name = req.params.name;
    ItemDB.find({ user: name }, function(error, data){
        if(error){
            res.status(404);
            res.send(error);
        }
        res.status(200);
        res.json(item);
    });
});


 app.delete('/api/items', (req, res) => {
    var item = req.body;
    ItemDB.findByIdAndRemove(item._id, function(error){
        if(error){
            res.status(500);
            res.send(error);
        }

        res.status(200);
        res.send("Item removed!");
    });
 });


 /**********************************************
  * START Server
  **********************************************/

db.on('open', function(){
    console.log("Yay!! DB connection succeeded");

    /*
        Data types allowed for schemas:
        String, Number, Date, Buffer, Boolean, ObjectId, Array
    */

    // Define structure (models) for the objects on each collection

    var itemsSchema = mongoose.Schema({
        code: String,
        description: String,
        price: Number,
        image: String,
        category: String,
        stock: Number,
        deliveryDayd: Number,
        user: String
    });

    var messageSchema = mongoose.Schema({
        name: String,
        message: String
    });

    ItemDB = mongoose.model("itemsCh6", itemsSchema);
    messageDB = mongoose.model("messagesCh6", messageSchema);

});

db.on('error', function(error){
    console.log("Error connecting to DB");
    console.log(error);
});

app.get('/aboutme', (req, res) =>{
    res.render('about.html');
});

app.listen(8080, function(){
    console.log("Server running at http://localhost:8080:");
    console.log("Press Ctrl+C to kill it");
});

/*
-1 created contact.html
-2 render from /contact
-3 check that localhost:8080/contact you can see the page
-4 create a form inside html page
-5 create the model to handle messages
-6 create a contact.js file that catches the click on send button
-7 create an AJAX post request to /api/messages
-8 Create enpoint GET on /api/messages that retrieves and sends all the messages
-9 Modify Admin.js, on Init call retrieveMessages function that gets the messages from api/messages

name _________________________
message ______________________
[send button]
*/
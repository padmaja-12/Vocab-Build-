var express         = require("express"),
    bodyParser      = require("body-parser"),
    axios           = require("axios"),
    firebase        = require("firebase/app"),
    app             = express();
    require("firebase/auth");
    require("firebase/firestore");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
var config = {
    apiKey: "AIzaSyB-voaCYOUak2Sp-q_7fyjC_oX6Kr3aZxY",
    authDomain: "vocab-build-2.firebaseapp.com",
    databaseURL: "https://vocab-build-2.firebaseio.com",
    projectId: "vocab-build-2",
    storageBucket: "vocab-build-2.appspot.com",
    messagingSenderId: "667765933177",
    appId: "1:667765933177:web:fe05041752663a9eb940a8",
    measurementId: "G-Q4BPXF26XJ"
  };
  firebase.initializeApp(config);

app.get("/", (req,res) => {
    res.render("landing");
});

app.get("/home",(req,res) => {
      res.render("home/home");
});

app.get("/set", (req,res) => {
    axios.get('https://vocab-build-2.firebaseio.com/set.json')
    .then(response => {
        let set = [];
        for(let key in response.data){
            set.push({name : response.data[key].setName,index : key});
        }
        res.render("set/set",{set:set});
    })
    .catch(error => {
        console.log(error);
    });
})

app.post("/set",(req,res) => {
    axios.post('https://vocab-build-2.firebaseio.com/set.json',{
        setName : req.body.setName
    })
    .then(response => {
        res.redirect("/set");
    })
    .catch(error => {
        console.log(error);
    });
})


app.get("/set/:setId/words",(req,res) => {
    let setId = req.params.setId;
    
})

app.listen(8080,() => {
    console.log("Vocabulary-app is up and running on PORT : 8080");
});

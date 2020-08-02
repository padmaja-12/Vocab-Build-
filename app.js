var express         = require("express"),
    bodyParser      = require("body-parser"),
    axios           = require("axios"),
    firebase        = require("firebase/app"),
    methodOverride = require('method-override'),
    app             = express();
    require("firebase/auth");
    require("firebase/firestore");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
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
    let id = null;
    res.render("landing",{id:id});
});

app.get("/:id/home",(req,res) => {
    let id = req.params.id;
      res.render("home/home",{id:id});
});

app.get("/:id/set", (req,res) => {
    let id = req.params.id;
    axios.get('https://vocab-build-2.firebaseio.com/'+ id + '/set.json')
    .then(response => {
        let set = [];
        for(let key in response.data){
            set.push({name : response.data[key].setName,index : key});
        }
        res.render("set/set",{set:set,id:id});
    })
    .catch(error => {
        console.log(error);
    });
})

app.post("/:id/set",(req,res) => {
    let id = req.params.id;
    axios.post('https://vocab-build-2.firebaseio.com/'+ id + '/set.json',{
        setName : req.body.setName
    })
    .then(response => {
        res.redirect("/"+ id + "/set");
    })
    .catch(error => {
        console.log(error);
    });
})


app.get("/:id/set/:setId/words",(req,res) => {
    let id = req.params.id;
    let setId = req.params.setId;
    axios.get('https://vocab-build-2.firebaseio.com/'+ id + '/set/'+ setId + '.json')
    .then(response => {
        let words = [];
        let s = 1;
        for(let key in response.data){
            words.push({w:response.data[key],index:s,indexOf : key});
            s=s+1;
        }
        words.pop();
        res.render("set/eachSet",{words: words,setId : setId,id:id});
    })
    .catch(error => {
        console.log(error);
    });
})



app.delete("/:id/set/:setId/words",(req,res) => {
    let id = req.params.id;
    let del = null;
    del = req.query.delete;
    let setId = req.params.setId;
    if(del !== null){
        axios.delete('https://vocab-build-2.firebaseio.com/'+ id + '/set/'+ setId +'/'+ del + '.json')
    .then(response => {
        res.redirect("/"+id+"/set/"+ setId + "/words") ;
    })
    .catch(error => {
        console.log(error);
    });
    }
})
app.put("/:id/set/:setId/words", (req,res) => {
    let id = req.params.id;
    let setId = req.params.setId;
    let change = req.query.change;
    axios.put('https://vocab-build-2.firebaseio.com/'+ id + '/set/'+ setId + '/'+ change + '.json' , {
        name : req.body.word.name,
        meaning : req.body.word.meaning,
        mnemonic : req.body.word.mnemonic,
        sentence : req.body.word.sentence
    })
    .then(respond => {
        res.redirect("/"+ id + "/set/"+ setId + "/words");
    })
    .catch(error => {
        console.log(error);
    })
})
app.post("/:id/set/:setId/words", (req,res) => {
    let id = req.params.id;
    let setId = req.params.setId;
    if(req.body.word.Learning){
        axios.post('https://vocab-build-2.firebaseio.com/' + id + '/learning.json',{
            name : req.body.word.name,
            meaning : req.body.word.meaning,
            mnemonic : req.body.word.mnemonic,
           sentence : req.body.word.sentence,
        });
    }
    if(req.body.word.Reviewed){
        axios.post('https://vocab-build-2.firebaseio.com/'+ id + '/reviewing.json',{
            name : req.body.word.name,
            meaning : req.body.word.meaning,
            mnemonic : req.body.word.mnemonic,
           sentence : req.body.word.sentence,
        });
    }
    if(req.body.word.Mastered){
        axios.post('https://vocab-build-2.firebaseio.com/'+ id + '/mastered.json',{
            name : req.body.word.name,
            meaning : req.body.word.meaning,
            mnemonic : req.body.word.mnemonic,
           sentence : req.body.word.sentence,
        });
    }
    axios.post('https://vocab-build-2.firebaseio.com/'+ id + '/set/'+ setId + '.json',{
        name : req.body.word.name,
        meaning : req.body.word.meaning,
        mnemonic : req.body.word.mnemonic,
        sentence : req.body.word.sentence
    })
    .then(response => {
        res.redirect("/"+ id + "/set/"+ setId + "/words");
    })
    .catch(error => {
        console.log(error);
    });
})

app.get("/:id/home/learning", (req,res) => {
    let id = req.params.id;
    axios.get('https://vocab-build-2.firebaseio.com/'+ id + '/learning.json')
    .then(response => {
        let words = [];
        let s = 1;
        for(let key in response.data){
            words.push({w:response.data[key],index:s,indexOf : key});
            s = s+1;
        }
        res.render("home/learning",{words: words,id:id});
    })
    .catch(error => {
        console.log(error);
    });
})

app.post("/:id/home/learning", (req,res) => {
    let id = req.params.id;
    let element = req.query.element;
    axios.post('https://vocab-build-2.firebaseio.com/'+ id + '/reviewing.json',{
        name : req.query.name,
        meaning : req.query.meaning,
        mnemonic : req.query.mnemonic,
       sentence : req.query.sentence
    });
    axios.delete('https://vocab-build-2.firebaseio.com/'+ id + '/learning/'+ element + '.json')
    .then(response => {
      res.redirect("/"+ id + "/home/learning");
    })
    .catch(error => {
        console.log(error);
    });
})

app.get("/:id/home/reviewing", (req,res) => {
    let id = req.params.id;
    axios.get('https://vocab-build-2.firebaseio.com/'+ id + '/reviewing.json')
    .then(response => {
        let words = [];
        let s = 1;
        for(let key in response.data){
            words.push({w:response.data[key],index:s,indexOf : key});
            s = s+1;
        }
        res.render("home/reviewing",{words: words,id:id});
    })
    .catch(error => {
        console.log(error);
    });
})

app.post("/:id/home/reviewing", (req,res) => {
    let id = req.params.id;
    let learn = req.query.learn;
    let master = req.query.master;
    let element ;
    if(learn !== undefined){
        axios.post('https://vocab-build-2.firebaseio.com/'+ id + '/learning.json',{
        name : req.query.name,
        meaning : req.query.meaning,
        mnemonic : req.query.mnemonic,
       sentence : req.query.sentence
    });
    element = learn;
    } 
    else if(master !== undefined){
        axios.post('https://vocab-build-2.firebaseio.com/'+ id +'/mastered.json',{
        name : req.query.name,
        meaning : req.query.meaning,
        mnemonic : req.query.mnemonic,
       sentence : req.query.sentence
    });
    element = master;
    }
    axios.delete('https://vocab-build-2.firebaseio.com/'+ id + '/reviewing/'+ element + '.json')
    .then(response => {
        res.redirect("/"+ id + "/home/reviewing");
    })
    .catch(error => {
        console.log(error);
    });
})

app.get("/:id/home/mastered", (req,res) => {
    let id = req.params.id;
    axios.get('https://vocab-build-2.firebaseio.com/'+ id + '/mastered.json')
    .then(response => {
        let words = [];
        let s = 1;
        for(let key in response.data){
            words.push({w:response.data[key],index:s,indexOf : key});
            s = s+1;
        }
        res.render("home/mastered",{words: words,id:id});
    })
    .catch(error => {
        console.log(error);
    });
})

app.post("/:id/home/mastered",(req,res) => {
    let id = req.params.id;
    let element = req.query.element;
    axios.post('https://vocab-build-2.firebaseio.com/'+ id + '/reviewing.json',{
        name : req.query.name,
        meaning : req.query.meaning,
        mnemonic : req.query.mnemonic,
       sentence : req.query.sentence
    });
    axios.delete('https://vocab-build-2.firebaseio.com/'+ id + '/mastered/'+ element + '.json')
    .then(response => {
      res.redirect("/"+id+"/home/mastered");
    })
    .catch(error => {
        console.log(error);
    });
})

app.get("/register",(req,res) => {
    let id = null;
    res.render("register",{id : id});
})
app.post("/register",(req,res) => {
    var email = req.body.email;
    var password = req.body.psw;
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(response => {
      // console.log(response);
       var id = response.user.uid;
        res.redirect("/"+ id + "/home");
    })
    .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.log(errorMessage)
        res.redirect("/register")
      });
})

app.get("/login",(req,res) => {
    let id = null;
    res.render("login",{id:id});
});

app.post("/login",(req,res) => {
    var email = req.body.email;
    var password = req.body.psw;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(response => {
        var id = response.user.uid;
       // console.log(response);
        res.redirect("/"+id+"/home");
    })
    .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            res.redirect("/login");
          } else {
            res.redirect("/register");
          }
      });
})

app.get("/logout",(req,res) => {
    firebase.auth().signOut().then(function() {
        res.redirect("/");
      }).catch(function(error) {
        console.log(error);
      });
})


app.listen(process.env.PORT,() => {
    console.log("Vocabulary-app is up and running on PORT : 8080");
});

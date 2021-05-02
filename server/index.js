const app = require('express')();
const mysql = require('mysql');
const PORT = 8080;

var con = mysql.createConnection({
    host: "mysql.webhosting38.1blu.de",
    user: "s301351_3211360",
    password: "MkSo!YW7!9KKTJC",
    database: "db301351x3211360"
  });

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

app.listen(
    PORT,
    () => console.log('Started Server on http://localhost: ' + PORT)
)

app.get('/today', (req, res) => {
    var curDate = new Date().toDateString();
    console.log("curDate :" + curDate);
    query=`SELECT * FROM feed WHERE feeddate = '${curDate}'`;
    con.query(query, function (err, result, fields){
        console.log(result);
    });
    res.status(200).send({

    })
})

app.get('/week', (req, res) => {
    // Send whole week
    res.status(200).send({
        
    })
})

app.post('/today', (req, res) => {

    // Write "morning" or "afternoon" into database
    res.status(200).send({
        
    })
})
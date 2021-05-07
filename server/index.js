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
    var curDate = new Date().toISOString().split("T")[0];
    var feeddate = new Date();
    var morning;
    var afternoon;
    var query=`SELECT * FROM feed WHERE feeddate = '${curDate}'`;
    con.query(query, function (err, result, fields){
        feeddate = result[0].feeddate.toLocaleDateString(); 
        console.log("feeddate: " + feeddate);
        morning = result[0].morning;
        afternoon = result[0].afternoon;

        res.status(200).send({
            feeddate : feeddate,
            morning : morning,
            afternoon : afternoon
        })
    }); 
})

app.get('/week', (req, res) => {
    // Send whole week
    var week = [];
    var curDate = new Date();
    var one_day = 1000 * 60 * 60 * 24;
    var dateSixDaysAgo = new Date(curDate - (one_day * 6)).toISOString().split("T")[0];
    console.log("dateSixDaysAgo: " + dateSixDaysAgo);
    curDate = curDate.toISOString().split("T")[0];
    console.log("curDate: " + curDate);
    var query=`SELECT * FROM feed WHERE feeddate BETWEEN '${dateSixDaysAgo}' AND '${curDate}'`;
    //var query = `SELECT * FROM feed WHERE feeddate BETWEEN '2021-04-30' AND '2021-05-07'`;
    con.query(query, function(err, result, fields){
        console.log(result.length);
        
        for (let i = 0; i < result.length; i++) {
            week.push({
                morning : result[i].morning,
                afternoon : result[i].afternoon,
                feeddate : result[i].feeddate.toLocaleDateString()
            })
        }
        
        res.status(200).send({
            week: week
        })
    })
    
});

app.post('/today', (req, res) => {

    // Write "morning" or "afternoon" into database with current Datestamp
    //
    res.status(200).send({
        
    })
})
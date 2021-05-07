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
    curDate = curDate.toISOString().split("T")[0];

    var query=`SELECT * FROM feed WHERE feeddate BETWEEN '${dateSixDaysAgo}' AND '${curDate}'`;
    con.query(query, function(err, result, fields){      
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
    var currentTime = new Date().toLocaleTimeString()
    var currentHour = currentTime.split(":")[0];
    console.log(currentHour);
    var curDate = new Date().toISOString().split("T")[0];
    var externSecret = req.headers.secret;
    var superSecret = 'mamamiadasistabereinsicherercode';
    if(externSecret === superSecret){
        var query=`SELECT * FROM feed WHERE feeddate = '${curDate}'`;
        con.query(query, function(err, result, fields){
            if(result.length === 0){
                //TODO No Feeding happened today, create a new Database Entry with todays Date and 
                // check current time. If Time < xx o Clock set morning to else, after time xx o Clock, set afternoon to true
                if(currentHour >= 0 && currentHour < 16){
                    query = `INSERT INTO feed (morning, afternoon, feeddate) VALUES ('1', '0', '${curDate}')`
                    con.query(query, function(err, result, fields){
                    res.status(200).send({
                        message : "Das morgentliche Fuettern war erfolgreich!"
                    })
                })
                }
                else{
                    query = `INSERT INTO feed (morning, afternoon, feeddate) VALUES ('0', '1', '${curDate}')`
                    con.query(query, function(err, result, fields){
                    res.status(200).send({
                        message : "Das abendliche Fuettern war erfolgreich!"
                    })
                })
                }
                
            }
            else{
                //Current Date already exists in Database, which means we only have to update the table and set afternoon = true
                // but check if afternoon is already true, then tell the client that no feeding is necessary
                if(result[0].afternoon === 0 && currentHour > 16){
                    query = `UPDATE feed SET afternoon = 1 WHERE feeddate = '${curDate}'`;
                    con.query(query, function(err, result, fields){
                        res.status(200).send({
                            message : "Abendliches Füttern war erfolgreich!"
                        })
                    })
                }
                else{
                    if(currentHour > 16){
                        res.status(400).send({
                            message : "Heute Abend wurde schon gefüttert"
                        })
                    }
                    else{
                        res.status(400).send({
                            message : "Heute Morgen wurde schon gefüttert"
                        })                    }
                }
            }
        })
        
    }
    else{
        res.status(400).send({
            message : "Du darfst aber gar keinen Futterstatus aendern :("
        })
    }
    
})
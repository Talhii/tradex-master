const mariadb = require('mariadb');
const express = require('express');
const app = express();

// const pool = mariadb.createPool({
//     host: 'u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//     user: 'jchdb2gwblgvf2q3',
//     password: 'yk8lclgw91poxjys',
//     database: 'glzuas0guazooigj'
// });



// **************************
// <New>
// **************************
// const pool = mariadb.createPool({
//     host: 'u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//     user: 'vze7g1v5a1ls85e7',
//     password: 'w6k72lnbaj0zll5u',
//     database: 'dxxqbhfht5pzehzx',
//     connectionLimit: 3
// });
// **************************
// </New>
// **************************

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'tradex'
});


pool.getConnection()
.then(conn => {console.log("connected");
// conn.end()

}).catch(err=>{
    console.log("DB not Conneted :" +err);
});


module.exports = pool;
'use strict';

const sqlite3 = require('sqlite3').verbose();
var db;

exports.setSecret = function(hash,secret,expireAfterViews,expireAfter, createdAt, callback) 
{
    connectDB()
   
    db.run(`INSERT INTO secrets(hash, secret, expireAfterViews, expireAfter, createdAt) VALUES(?,?,?,?,?)`,
          [hash, secret, expireAfterViews, expireAfter, createdAt], function(err) {
       if (err) {
         return console.log(err.message);
       }
       // get the last insert id
       console.log(`A row has been inserted with rowid ${this.lastID}`);

        getSecret(hash, (row) => {
          callback(row);
        });
     });
  
     closeDB();
}

exports.getSecretByHash = function(hash, callback) {
    getSecret(hash, (row) => {
        setExpireAfterViews(hash, row.remainingViews, (hash) => {
            getSecret(hash, (row) => {
                callback(row)
            })
        })        
    })
}

function setExpireAfterViews(hash, expireAfterViews, callback)
{
    let data = [expireAfterViews - 1, hash];
    let sql = `UPDATE secrets
            SET expireAfterViews = ?
            WHERE hash = ?`;
    
    db.run(sql, data, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
        callback(hash);
    });
}

function getSecret (hash, callback) {
    connectDB()
    
          let sql = `SELECT hash, secret secretText,
          expireAfterViews remainingViews, expireAfter expiresAt, createdAt
             FROM secrets
             WHERE hash  = ?`;
   
  // first row only
  db.get(sql, [hash], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(row.hash);
    callback(row);
   
  });
          closeDB();
  }

  exports.createTable = function() 
  {
      connectDB()
	
      db.run('CREATE TABLE Secrets(hash text,secret text,expireAfterViews int, expireAfter int, createdAt int)');
    
       closeDB();
  }

function connectDB()
{
  db = new sqlite3.Database('./secrets.db',  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to secrets database.');
  });
}

function closeDB()
{
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
    
  });
}

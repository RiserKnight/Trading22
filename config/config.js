const fs = require('fs');
require('dotenv').config();
module.exports ={
  "development": {
    "username": "postgres",
    "password": process.env.DB_PASS,
    "database": "Trading",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "test": {
    "username": "postgres",
    "password": process.env.DB_PASS,
    "database": "Trading",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": "postgres",
    "password": process.env.DB_PASS,
    "database": "Trading",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  }
}

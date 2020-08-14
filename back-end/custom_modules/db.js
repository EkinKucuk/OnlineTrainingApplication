"use strict";

const config = require('../bin/config');
const { Pool, Client } = require('pg');


const pool = new Pool({
    connectionString: config.database.connectionString,
});

const selectAll = (req, res, tableName) => {

    
    const query = "SELECT * from " + tableName;
    pool.query(query, (err, result) => {
        if (err) {
            console.log(err.stack);
        } else {
            res.json(result.rows);
        }
    })

}

module.exports = {

    selectAll,
    pool
}
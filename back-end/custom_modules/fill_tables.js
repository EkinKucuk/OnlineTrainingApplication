/*

    Example data to fill the tables.

*/

"use strict";

const { Pool, Client } = require('pg');
const connectionString = 'postgres://nrkkvdll:fRdN-DupkKbV1pE8rbn8QLE9nzPqf7r2@manny.db.elephantsql.com:5432/nrkkvdll';
const format = require('pg-format');

const pool = new Pool({
    connectionString: connectionString,
});


const defaultRoles = [ // ICTerra ilk dökümantasyondaki roller.
    ["Course Coordinator"],
    ["Exam Coordinator"],
    ["Exam Instructor"],
    ["Instructor"],
    ["Training Participant"],
    ["Exam Participant"],
    ["Admin"],
    ["Human Resources"],
];

const exampleUsers = [
    [
        "Turhan",
        "Gür",
        "contact@turhangur.com",
    ]
]


/*
    Insert example data to Roles table.
*/


const query1 = format("INSERT INTO roles (role_name) VALUES %L;", defaultRoles);
pool.query(query1, (err, res) => {

    if(err){
        console.log(err);
    }
    else {
        console.log(res, "Örnek roller yaratıldı.");
    }
});

/*
const query2 = format('INSERT INTO users (first_name, last_name, email) VALUES %L', exampleUsers);
console.log(query2);
pool.query(query2, (err, res) => {

    if(err){
        console.log(err);
    }
    else {
        console.log(res, "Örnek kullanıcılar yaratıldı.");
    }
});
*/

pool.end();
"use strict";

const { Pool, Client } = require('pg');
const connectionString = 'postgres://nrkkvdll:fRdN-DupkKbV1pE8rbn8QLE9nzPqf7r2@manny.db.elephantsql.com:5432/nrkkvdll';

const pool = new Pool({
    connectionString: connectionString,
});
/*
pool.query('CREATE TABLE roles(id SERIAL PRIMARY KEY, role_name VARCHAR(20) NOT NULL UNIQUE)', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Role Table has been created.");
    }

});
*/
/*
pool.query('CREATE TABLE users(id SERIAL PRIMARY KEY, first_name VARCHAR(40) NOT NULL, \
    last_name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL UNIQUE, password VARCHAR(60) NOT NULL)', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "User Table has been created.");
    }

});
*/

/*
pool.query('CREATE TABLE course_types(id SERIAL PRIMARY KEY, type_name VARCHAR(40) NOT NULL UNIQUE)', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Types Table has been created.");
    }

});

x
*/


/*
pool.query('CREATE TABLE user_roles(user_id INTEGER REFERENCES users(id), role_id INTEGER REFERENCES roles(id), PRIMARY KEY(role_id, user_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "User-Roles Table has been created.");
    }

});
*/
/*
pool.query('CREATE TABLE course_roles(user_id INTEGER REFERENCES users(id), role_id INTEGER REFERENCES roles(id), course_id INTEGER REFERENCES courses(id), PRIMARY KEY(role_id, user_id, course_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "User-Roles Table has been created.");
    }

});
*/


/*
pool.query('CREATE TABLE modules(course_id INTEGER NOT NULL REFERENCES course(id), \
    module_id INTEGER NOT NULL, module_typeid INTEGER REFERENCES module_types(id), \
    module_name VARCHAR(40) NOT NULL, module_desc VARCHAR(200) NOT NULL, module_path VARCHAR(10) NOT NULL  \
    PRIMARY KEY(course_id, module_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Types Table has been created.");
    }

});

*/

/*

pool.query('CREATE TABLE course_reviews(course_id INTEGER NOT NULL REFERENCES course(id), \
    user_id INTEGER NOT NULL REFERENCES users(id), course_reviewheader VARCHAR(75) NOT NULL, course_review \
    TEXT NOT NULL, course_rating INTEGER NOT NULL,  \
    PRIMARY KEY(course_id, user_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Reviews Table has been created.");
    }

});
*/
/*
pool.query('CREATE TABLE permissions(id SERIAL PRIMARY KEY, permission_name VARCHAR(60) NOT NULL UNIQUE)', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Permissions Table has been created.");
    }

});
*/

pool.query('CREATE TABLE role_permissions(permission_id INTEGER REFERENCES permissions(id), role_id INTEGER REFERENCES roles(id), PRIMARY KEY(permission_id, role_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "User-Roles Table has been created.");
    }

});
/*

    Course Table:
    id,
    course_name,
    course_desc,
    course_goals,
    course_type, REFERENCES course_types
    course_status, 
    course_hasExam,
    course_isPrivate,

    Course (Yaratıldı)
    Course Types (Yaratıldı)
    Course Training Coordinators (Yaratıldı)
    Course Exam Coordinators (Yaratıldı)
    Course Instructors (Yaratıldı)
    Course Exam Maker (Yaratıldı)
    Course Participants (Yaratıldı)


*/

/*

pool.query('CREATE TABLE course(id SERIAL PRIMARY KEY, course_name VARCHAR(40) NOT NULL, \
course_desc TEXT, course_goals TEXT, course_type INTEGER REFERENCES course_types(id) NOT NULL, \
course_status BOOLEAN NOT NULL, course_hasExam BOOLEAN NOT NULL, course_isPrivate BOOLEAN NOT NULL)', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Table has been created.");
    }

});
*/
/*
pool.query('CREATE TABLE course_tcoordinators(course_id INTEGER REFERENCES course(id), user_id INTEGER REFERENCES users(id), PRIMARY KEY(course_id, user_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Training Coordinators Table has been created.");
    }
});
*/
/*
pool.query('CREATE TABLE course_ecoordinators(course_id INTEGER REFERENCES course(id), user_id INTEGER REFERENCES users(id), PRIMARY KEY(course_id, user_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Exam Coordinators Table has been created.");
    }
});
*/


/*
pool.query('CREATE TABLE course_instructors(course_id INTEGER REFERENCES course(id), user_id INTEGER REFERENCES users(id), PRIMARY KEY(course_id, user_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Instructor Table has been created.");
    }
});
*/
/*
pool.query('CREATE TABLE course_einstructors(course_id INTEGER REFERENCES course(id), user_id INTEGER REFERENCES users(id), PRIMARY KEY(course_id, user_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Exam Instructor Table has been created.");
    }
});
?/
/*
pool.query('CREATE TABLE course_participants(course_id INTEGER REFERENCES course(id), user_id INTEGER REFERENCES users(id), hasCompletedCourse BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY(course_id, user_id))', (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res, "Course Participants Table has been created.");
    }
});
*/




pool.end();



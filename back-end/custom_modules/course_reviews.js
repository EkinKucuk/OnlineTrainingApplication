"use strict";

const db = require('../custom_modules/db');
const config = require('../bin/config');

const addReview = (json, callback) => {

    const { course_id, user_id, course_reviewheader, course_review, course_rating  } = json;

    const query = {
        text: 'INSERT INTO course_reviews(course_id, user_id, course_reviewheader, course_review, course_rating ) VALUES($1, $2, $3, $4, $5)',
        values: [course_id, user_id, course_reviewheader, course_review, course_rating]
    }

    // callback
    db.pool.query(query, (err, result) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
            callback(json)
        } else {
            json.message = "Kullanıcının yorumu başarıyla eklenmiştir."
            callback(json)
        }
    })

}

const getReview = (course_id, user_id, callback) => {

    const query = {
        text: 'SELECT * from course_reviews where course_id = $1 AND user_id = $2',
        values: [course_id, user_id]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}

const getAllReviews = (course_id, callback) => {

    const query = {
        text: 'SELECT * from course_reviews where course_id = $1',
        values: [course_id]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}

const getReviewAverage = (course_id, callback) => {

    const query = {
        text: 'SELECT to_char( AVG(course_rating), "999999999" ) AS rating_average from course_reviews where course_id = $1',
        values: [course_id]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}


const deleteReview = (course_id, user_id, callback) => {

    const query = {
        text: 'DELETE from course_reviews where course_id = $1 AND user_id = $2',
        values: [course_id, user_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Yorum silinirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Yorum başarıyla silinmiştir."
            }
            callback(json);
        }


    })

}

const updateReview = (json, callback) => {

    const { course_id, user_id, course_reviewheader, course_review, course_rating} = json;
    const query = {
        text: 'UPDATE course_reviews SET course_reviewheader = $1, course_review = $2, course_rating = $3 where course_id = $4 AND user_id = $5',
        values: [course_reviewheader,course_review, course_rating, course_id, user_id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Yorum başarıyla güncellenmiştir."
        }
        callback(json);

    })

}



module.exports = {
    addReview,
    getReview,
    deleteReview,
    updateReview,
    getAllReviews

}


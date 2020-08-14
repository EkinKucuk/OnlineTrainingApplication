"use strict";

const db = require('../custom_modules/db');
const config = require('../bin/config');

const getExams = (course_id, callback) => {


    const query = {
        text: 'SELECT * from exam where course_id = $1',
        values: [course_id]
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
            callback(result);
        }
    })

}

const createExam = (course_id, exam_name, exam_description, callback) => {

    const query = {
        text: 'INSERT INTO exam(course_id, exam_name, exam_description)\
         VALUES($1, $2, $3)',
        values: [course_id, exam_name, exam_description]
    }

    // callback
    db.pool.query(query, (err, result2) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
            callback(json)
        } else {

            json.message = "Sınav başarıyla yaratılmıştır."
            callback(json)
        }
    })

}

const deleteExam = (exam_id, course_id, callback) => {
    const query = {
        text: 'DELETE from exam where id = $1 AND course_id = $2',
        values: [exam_id, course_id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Silme işlemi başarıyla gerçekleşmiştir."
        }
        callback(json);

    })
}

const deleteQuestion = (exam_id, question_id, callback) => {

    let query;
    query = {
        text: 'DELETE from question_options where question_id = $1',
        values: [question_id]
    }

    db.pool.query(query, (err, result) => {


        if(err){
            let json = {
                err: err,
                message: "Sistemsel hata oluşmuştur."
            }
            callback(json);
            
        }
        else {
            query = {
                text: 'DELETE from question where id = $2 AND exam_id = $1',
                values: [exam_id, question_id]
            }
        
            db.pool.query(query, (err, result) => {
        
                let json;
                if (err){
                    json = {
                        err: err,
                    message: null
                    }   
                }
                else {
                    json = {
                        err: null,
                        message: "Silme işlemi başarıyla gerçekleşmiştir."
                    }
                }
            
                
                callback(json);
        
            })
        }
            
        

    })

    
}

const updateExam = (exam_id, course_id, exam_name, exam_description, callback) => {

    const query = {
        text: 'UPDATE exam SET exam_name = $1, exam_description = $2 where id = $3 AND course_id = $4',
        values: [exam_name, exam_description, exam_id, course_id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Sınav başarıyla güncellenmiştir."
        }
        callback(json);

    })

}

const editQuestion = (question, answer1, answer2, answer3, answer4, correct_answer, editAnswer1Id, editAnswer2Id, editAnswer3Id, editAnswer4Id, callback) => {

    const query = {
        text: 'UPDATE question SET question_name = $2, answer_description = $3 where id = $1',
        values: [question.question_id, question.question_name, question.answer_description]
    }

    // callback
    db.pool.query(query, (err, result2) => {
        let json = {
            err: null,
            message: ""
        }
        if (err) {
            json.err = err;
            json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
            callback(json)
        } else {

            let boolArray = [
                false,
                false,
                false,
                false
            ];
            boolArray[correct_answer - 1] = true;

            let query1 = {
                text: 'UPDATE question_options SET answer=$2, correct_answer = $3 WHERE question_id= $1 AND id = $4;',
                values: [question.question_id, answer1, boolArray[0], editAnswer1Id ]
            }
            
            db.pool.query(query1, (err, result) => {

                if (err){
                    json = {
                        err: err,
                        message: "There was error."
                    }
                    callback(json);
                }
                else {

                    let query2 = {
                        text: 'UPDATE question_options SET answer=$2, correct_answer = $3 WHERE question_id= $1 AND id = $4;',
                        values: [question.question_id, answer2, boolArray[1], editAnswer2Id ]
                    }
                    
                    db.pool.query(query2, (err, result) => {
        
                        if (err){
                            json = {
                                err: err,
                                message: "There was error."
                            }
                            callback(json);
                        }
                        else {

                            let query3 = {
                                text: 'UPDATE question_options SET answer=$2, correct_answer = $3 WHERE question_id= $1 AND id = $4;',
                                values: [question.question_id, answer3, boolArray[2], editAnswer3Id ]
                            }
                            
                            db.pool.query(query3, (err, result) => {
                
                                if (err){
                                    json = {
                                        err: err,
                                        message: "There was error."
                                    }
                                    callback(json);
                                }
                                else {

                                    let query4 = {
                                        text: 'UPDATE question_options SET answer=$2, correct_answer = $3 WHERE question_id= $1 AND id = $4;',
                                        values: [question.question_id, answer4, boolArray[3], editAnswer4Id ]
                                    }
                                    
                                    db.pool.query(query4, (err, result) => {
                        
                                        if (err){
                                            json = {
                                                err: err,
                                                message: "There was error."
                                            }
                                            callback(json);
                                        }
                                        else {
                                            json = {
                                                err: null,
                                                message: "Başarıyla güncellenmiştir."
                                            }
                                            callback(json);
                                            
                                        }
                                       
                                
                                    })
                                    
                                }
                               
                        
                            })
                            
                        }
                       
                
                    })

                }
               
        
            })


        }
    })

}

const createQuestion = (question, answer1, answer2, answer3, answer4, correct_answer, callback) => {

    const query = {
        text: 'INSERT INTO question(exam_id, question_name, answer_description)\
         VALUES($1, $2, $3) RETURNING id',
        values: [question.exam_id, question.question_name, question.answer_description]
    }

    // callback
    db.pool.query(query, (err, result2) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
            callback(json)
        } else {

            const question_id = result2.rows[0].id;

            let boolArray = [
                false,
                false,
                false,
                false
            ];
            boolArray[correct_answer - 1] = true;

            let query1 = {
                text: 'INSERT INTO question_options(question_id, answer, correct_answer)\
                 VALUES($1, $2, $3),($1, $4, $5),($1, $6, $7),($1, $8, $9)',
                values: [question_id, answer1, boolArray[0], answer2, boolArray[1], answer3, boolArray[2], answer4, boolArray[3] ]
            }
            
            db.pool.query(query1, (err, result) => {

                let json = {
                    err: null,
                    message: "Soru başarıyla eklenmiştir."
                }

                if (err){
                    json = {
                        err: err,
                        message: "There was error."
                    }
                }
                callback(json);
        
            })


        }
    })

}

const getQuestions = (exam_id, callback) => {

    const query = {
        text: 'SELECT * from question, question_options where question_options.question_id = question.id AND question.exam_id = $1',
        values: [exam_id]
    }

    db.pool.query(query, (err, result) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
            callback(json)
        } else {
            callback(result);
        }
    })

}
module.exports = {
    createExam,
    getExams,
    deleteExam,
    updateExam,
    createQuestion,
    getQuestions,
    deleteQuestion,
    editQuestion

}
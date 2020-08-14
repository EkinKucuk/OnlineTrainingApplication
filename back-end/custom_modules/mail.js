var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ctisteam7@gmail.com',
        pass: 'Ci9MmzCgJVeSWG8'
    }
});

const sendEmail = (res, subject, text, receiver) => {
    
    const mailOptions = {
        from: 'ctisteam7@gmail.com',
        to: receiver,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            ResponseHandler.returnSystemError(res);
        } else {
            console.log('Email sent: ' + info.response);
            res.json({
                success: true,
            });
        }
    });
}


module.exports = {
    sendEmail

}
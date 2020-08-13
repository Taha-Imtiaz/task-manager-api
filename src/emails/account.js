const sgMail = require("@sendgrid/mail")




//sendgrid module know we work the above Api key
//when we send email send grid know it is associated with my account
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//send email 
// sgMail.send({
//     to: "tahaimtiaz1996@gmail.com",
//     from: "tahaimtiaz1996@gmail.com",
//     //email subject and text
//     subject: 'This is my first creation',
//     //we use html property to setup styled html email
//     text: 'I hope this one actually get to you'
// })

//take the name and email of a user
const sendWelcomeEmail =  (email, name) => {
    sgMail.send({
        to: email,
        from: 'tahaimtiaz1996@gmail.com',
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name} . Let me know how you get along with the app`
    })
}
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "tahaimtiaz1996@gmail.com",
        subject: "Sorry to see you go",
        text: `GoodBye! ${name}. I hope to see you back sometime soon`
    })
}
module.exports = {
    sendWelcomeEmail : sendWelcomeEmail,
    sendCancellationEmail: sendCancellationEmail
}
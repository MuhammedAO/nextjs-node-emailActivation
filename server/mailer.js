const nodemailer = require('nodemailer')

exports.sendConfirmationEmail = ({ toUser, hash }) => {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD
      }
    })

    const message = {
      from: process.env.GOOGLE_USER,
      //in a prod environment
      // to: toUser.email
      //testing 
      to: process.env.GOOGLE_USER,
      subject: 'My APP - Activate Account',
      html: `
        <h3>Hello ${toUser.username}</h3>
        <p>Thank you for registering! You're almost there. Please click on this Link to activate your account:
        <a target="_" href="${process.env.DOMAIN}/api/activate/user/${hash}">Activate</a>
        </p>
        <p>Thank you.</p>
        <p>Application Team</p>
      `
    }

    transporter.sendMail(message, (err, info) => {
      if (err) {
        rej(err)
      } else {
        res(info)
      }
    })
  })
}
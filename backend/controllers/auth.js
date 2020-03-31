const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// exports.signup = (req, res) => {
//   const { name, email, password } = req.body;

//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is taken"
//       });
//     }
//   });

//   let newUser = new User({ name, email, password });
//   newUser.save((err, success) => {
//     if (err) {
//       console.log("Singup error", err);
//       return res.status(400).json({
//         error: err
//       });
//     }
//     return res.json({
//       message: "Signup success ! please sign in"
//     });
//   });
// };

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken"
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "5m" }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `<h6> Please use the following link to account</h6>
             <p> ${process.env.CLIENT_URL}/auth/activate/${token}</p>
             <hr />
             <p> this email may contain sensitive information</p>`
    };
    sgMail
      .send(emailData)
      .then(sent => {
        console.log("singup email sent", sent);
        return res.json({
          message: ` Email has been sent to ${email}. Follow the instruction to signup `
        });
      })
      .catch(err => {
        console.log("singup email not sent error ", err);
        return res.json({
          message : err.message
        })

      });
  });
};

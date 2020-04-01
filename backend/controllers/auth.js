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
      { expiresIn: "1d" }
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
          message: err.message
        });
      });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(
      err,
      decoded
    ) {
      if (err) {
        console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Expired link. Signup again"
        });
      }

      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });

      user.save((err, user) => {
        if (err) {
          console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Error saving user in database. Try signup again"
          });
        }
        return res.json({
          message: "Signup success. Please signin."
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong. Try again."
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with tha email does not exist ,Please Signup"
      });
    }

    // authentcate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Password do not match"
      });
    }

    // generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role }
    });
  });
};

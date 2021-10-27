const crypto = require("crypto");
const Student = require("../models/Student")
const ErrorResponse = require("../utils/errorResponse");
//REGISTER
const sendEmail = require("../utils/sendEmail");

exports.register2 = async (req,res,next) => {
    const { studentname,email,password} = req.body;
    console.log(req.body)
    try {
        const student = await Student.create({
            studentname,
            email,
            password
        });

        // res.status(201).json({
        //     success: true,
        //     student:student
        // })
        sendToken(student,201,res)
    } catch (error) {
        console.log(error)
       next(error)
    }

}


//LOGIN



exports.login2 = async (req,res,next) => {
    const {email,password} = req.body;
    if(!email || !password){
       return next(new ErrorResponse("please Provide an email & Password",400))
    }

    try {
        const student = await Student.findOne({email}).select("+password")

        if(!student){
            return next(new ErrorResponse("Invalid Credentials",401))
        }
        
        const isMatch = await student.matchPasswords(password)

        if(!isMatch){
            // res.status(404).json({
            //     success:false,
            //     error:"Invalid Credentials"
            // })
            return next(new ErrorResponse("Invalid Credentials",401))
        }

        // res.status(201).json({
        //     success: true,
        //     token:"1233434343"
        // })

        sendToken(student,200,res)


    } catch (error) {
       next(error)
    }

}


//FORGETPASS

exports.forgotpassword2 = async (req,res,next) => {
    // Send Email to email provided but first check if student exists
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return next(new ErrorResponse("No email could not be sent", 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = student.getResetPasswordToken();

    await student.save();

    // Create reset url to email to provided email
    const resetUrl = `https://onenationonehealth1.herokuapp.com/passwordreset/${resetToken}`;

    // HTML Message
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: student.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.log(err);

      student.resetPasswordToken = undefined;
      student.resetPasswordExpire = undefined;

      await student.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
}

//RESETPASS


exports.resetpassword2 = async (req,res,next) => {
    // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.resetToken)
  .digest("hex");

try {
  const student = await Student.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!student) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  student.password = req.body.password;
  student.resetPasswordToken = undefined;
  student.resetPasswordExpire = undefined;

  await student.save();

  res.status(201).json({
    success: true,
    data: "Password Updated Success",
    token: student.getSignedJwtToken(),
  });
} catch (err) {
  next(err);
}
}



const sendToken = (student, statusCode, res) => {
    const token = student.getSignedJwtToken();
    const student_id = student._id;
    res.status(statusCode).json({ sucess: true, token,student_id});
  };
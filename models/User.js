const crypto = require("crypto");
var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please provide a username"]
    },
    email:{
        type:String,
        required:[true,"please provide a email"],
        unique: true,
        
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "please provide a valid email"
        ]

    },
    password:{
        type:String,
        required:[true,"please add a password"],
        minlength: 6,
        select : false
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    

},{ timestamps: true });

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next();
})


userSchema.methods.matchPasswords = async function(password) {
    console.log(password,this.password)
    return await bcrypt.compare(password , this.password);
}


userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

  //for Ressetting password

  userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
  
    return resetToken;
  };

const User = mongoose.model("User",userSchema);

module.exports = User;
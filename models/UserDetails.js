var mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    subject:{
        type:String,
      
    },
    time:{
        type:String,
        
    },
    classofFaculty:{
        type:String
    },
    items:[{
        studentName:String,
        enrollmentNumber:String,
    }],
    user :
        {type: mongoose.Schema.Types.ObjectId,
        ref: "User"},
    
},{ timestamps: true });

const UserDetails = mongoose.model("UserDetails",userDetailsSchema);

module.exports = UserDetails;
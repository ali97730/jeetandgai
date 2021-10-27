const User = require("../models/User");
const UserDetails = require("../models/UserDetails")
const Student = require("../models/Student");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");


exports.getPrivateRoute = (req, res, next) => {
    res
      .status(200)
      .json({
        success: true,
        data: "You got access to the private data in this route",
      });
  };

exports.submitUserDetails = async (req,res,next) => {

  
 
  const {  subject,
    time,
    classofFaculty,
    items
    } = req.body;
   const id = req.params.user_id;
    const stringToJson = JSON.parse(items)
    console.log(stringToJson)
    console.log(req.body)

    try {

      // var imageUrlList = [];
  
      //   for (var i = 0; i < req.files.length; i++) {
      //       var locaFilePath = req.files[i].path;
  
      //       // Upload the local image to Cloudinary
      //       // and get image url as response
      //       var result = await cloudinary.uploader.upload(locaFilePath);
      //       imageUrlList.push({cloudinary_id:result.public_id,image_url:result.secure_url});
      //   }
      // Upload image to cloudinary
      //const result = await cloudinary.uploader.upload(req.file.path);
  
      
      // Create new user
      let userDetails = await new UserDetails({
        subject:subject,
        time:time,
        classofFaculty:classofFaculty,
       items:stringToJson,
       user:id
      });
      // Save user
       await userDetails.save();
      res.json(userDetails);//we are sending to front end
    } catch (err) {
      console.log(err);
    }
    

}


exports.getUserDetails = async(req,res,next) =>{

  try {
     let userDetails =  await UserDetails.findOne({user:req.params.user_id})
     console.log(req.params.user_id)
      res.send(userDetails)

  } catch (error) {
    console.log(error)
  }
}



exports.updateUserDetails = async (req,res,next) => {

  
 
  const {
    items,studentid} = req.body;

   const id = req.params.user_id;
   const stringToJson = JSON.parse(items)
    try {

      // var imageUrlList = [];
      //   for (var i = 0; i < req.files.length; i++) {
      //       var locaFilePath = req.files[i].path;
  
      //       // Upload the local image to Cloudinary
      //       // and get image url as response
      //       var result = await cloudinary.uploader.upload(locaFilePath);
      //       imageUrlList.push({cloudinary_id:result.public_id,image_url:result.secure_url});
      //   }
      // Upload image to cloudinary
      //const result = await cloudinary.uploader.upload(req.file.path);
  
      update = {
        $set: { 
          // fullname:fullname,
          // contactNumber :contactNumber,
          // age:age,
          // address:address,
          // city:city,
          // state:state,
          // pincode:pincode,
          // gender:gender,
          // dateOfBirth:dateOfBirth,
          // emergencyPhoneNumber:emergencyPhoneNumber,
          // bloodGroup:bloodGroup,
          // familyDoctorNumber:familyDoctorNumber,
          // anyDisability:anyDisability,
          // severeDisease:severeDisease,
          // donor:donor,
          items:stringToJson
          }
    }
     let UpdatedUser= await UserDetails.findOneAndUpdate({user:id},update,{upsert:true,new:true})
      // Save user
      
      let StudentDetails = await Student.findById({_id:studentid})
      const temp =  StudentDetails.subjects
      const sn = UpdatedUser.subject
      console.log(sn)
      const filteredArray = temp.filter((value)=>{
        value.subjectName === sn

      })

      console.log(filteredArray)
      var finalarray = {
        subjectName:sn,
        attendance:0 + 
      }

      

      

      // console.log(finalarray)
      
      let UpdatedStudentDetails = await Student.findByIdAndUpdate({_id:studentid},{$push:{subjects:finalarray}},{upsert:true,new:true})
      res.json(UpdatedStudentDetails.subjects);//we are sending to front end
      await UpdatedUser.save();
      await UpdatedStudentDetails.save();
    } catch (err) {
      console.log(err);
    }
    
    


}


exports.deleteImage = async (req,res) => {
  const id = req.params.user_id;
  console.log(id)
  const image_id = req.body.image_id;
  console.log(req.headers)
  let UpdatedUser= await UserDetails.findOneAndUpdate({user:id},{$pull:{images:{_id:image_id}}},{upsert:true,new:true})
 
  UpdatedUser.save();
  res.json(UpdatedUser)

  }


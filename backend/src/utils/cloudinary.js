const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary =async (localFilePath)=>{
    if(!localFilePath){
        return null;
    }

    try {
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("File uploaded to cloudinary successfully", res);
        return res;
    }
    
    catch (error) {
        console.log("Failed to upload file on cloudinary", error)
    }
};


module.exports=uploadOnCloudinary;
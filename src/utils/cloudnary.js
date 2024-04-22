import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})




cloudinary.config({
    cloud_name: process.env.CLOUDINAY_CLOUD_NAME,
    api_key: process.env.CLOUDINAY_API_KEY,
    api_secret: process.env.CLOUDINAY_API_SECRET
});


const uploadOnCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) return null
        console.log(localfilePath);
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        })

        console.log("File has been uploaded on cloudinary", response.url);

        // fs.unlinkSync(localfilePath)
        return response
    } catch (error) {
        console.log("Cloud: ", error);
        fs.unlinkSync(localfilePath)
        return null
    }
}

export { uploadOnCloudinary }
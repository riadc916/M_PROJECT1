//from(file)->backend(for parse the file like image)->cloudinary(store the file)
//cloudinary send link/file to backend -> save the data in mongodb

//User ফাইল upload করে (form-data দিয়ে)

// Multer request থেকে file ধরে

// multer-storage-cloudinary middleware Multer কে instruct করে →
// "এই file টা local এ save না করে সরাসরি Cloudinary তে পাঠাও"

// Cloudinary SDK ফাইলকে Cloud এ সেভ করে এবং একটা public URL ফেরত দেয়

// সেই URL তোমার database এ save করতে পারো, অথবা frontend এ দেখাতে পারো।


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust-DEV',
    allowed_formats: ["jpg","png","jpeg"] // supports promises as well
  },
});

module.exports={
    cloudinary,
    storage
}
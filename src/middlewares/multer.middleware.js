import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //local file path /public/temp
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        //we will get original file name
        cb(null, file.originalname)
    }

})

// const storage = multer.diskStorage({
//     destination: "./public/temp/",
//     filename: function (req, file, cb) {
//         cb(
//             null,
//             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         );
//     },
// });

export const upload = multer({
    // resolveWithFullPath: true,
    storage: storage
})
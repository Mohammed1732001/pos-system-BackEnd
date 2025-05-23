// ده بتاع محمود علوان 
// import multer from "multer";
// export const fileValidation = {
//     image: ["image/png", "image/jpeg", "image/gif"],
//     file: ["application/pdf", "application/vnd.ms-excel", "application/msword"],
// }
// export function fileUpload(customValidation = []) {
//     const storage = multer.diskStorage({})
//     // const storage = multer.memoryStorage({})
//     function fileFilter(req, file, cb) {
//         if (customValidation.includes(file.mimetype)) {
//             cb(null, true)
//         } else {
//             cb("in-valied extinsion", false)
//         }
//     }
//     const upload = multer({ dest: "/uploads", fileFilter, storage })
//     // const upload = multer({ fileFilter, storage })
//     return upload;
// }



// ده بعد التعديل 
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/gif"],
};

function fileFilter(req, file, cb) {
  if (fileValidation.image.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
}

export function fileUpload() {
  return multer({ storage, fileFilter });
}

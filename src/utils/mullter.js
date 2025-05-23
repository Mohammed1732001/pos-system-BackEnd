import multer from "multer";
import { nanoid } from "nanoid";
// import path from "path"                                                      ده لو ملف upload غير موجود جمب ال index
// import { fileURLToPath } from "url"                                          ده لو ملف upload غير موجود جمب ال index
// const __direname = path.dirname(fileURLToPath(import.meta.url))              ده لو ملف upload غير موجود جمب ال index


export const fileValidation = {
    image: ["image/png", "image/jpeg", "image/gif"],
    file: ["application/pdf", "application/vnd.ms-excel", "application/msword"],
}



export function fileUpload(customPath = "genral", customValidation = []) {


    // const fullPath = path.join(__direname, "../uploads")             ده لو ملف upload غير موجود جمب ال index
    // console.log({fullPath});                                         ده لو ملف upload غير موجود جمب ال index


    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${customPath}`)
        },
        filename: (req, file, cb) => {

            const sufixName = nanoid() + "_" + file.originalname
            console.log(file);
            file.dest = `uploads${customPath}/${sufixName}`
            cb(null, sufixName)
        }
    })




    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb("in-valied extinsion", false)
        }
    }


    const upload = multer({ dest: "/uploads", fileFilter, storage })
    return upload;
}



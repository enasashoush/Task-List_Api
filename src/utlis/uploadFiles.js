import multer from "multer"
import { nanoid } from "nanoid"
import fs from 'fs'
import path from 'path'


export const fileValidation = {
    image: ['image/png', 'image/jpeg', 'image/gif'],
    pdf: ['application/pdf']
}

const uploadFile = ({customValidation,customPath}= {}) => {


    const finalPath = path.resolve(`uploads/${customPath}`)

    if(!fs.existsSync(finalPath)){

        fs.mkdirSync(finalPath  ,{recursive: true});

    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, finalPath)
        },
        filename: (req, file, cb) => {
            const fileName = `${nanoid()}_ ${file.originalname}`
            file.finalDest = `uploads/${customPath}/${fileName}`
            cb(null, fileName)
        }
    })

    const fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)

        } else {
            cb(new Error('Invalid format'), false)
        }
    }

    const upload = multer({ dest: 'uploads',fileFilter, storage })

    return upload
}

export default uploadFile
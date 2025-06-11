// Asegúrate de que el directorio "uploads" existe
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { cwd } from 'process';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export default function buildUploadProcessor() {
    const __dirname = cwd();
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    // Configuración del almacenamiento con multer
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
    });

    // Filtro para asegurarse de que solo se suban vídeos
    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype.startsWith('video/mp4')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de vídeo'));
        }
    };

    const upload = multer({ storage, fileFilter });

    return { upload, fileFilter };
}


import multer from 'multer';
import {randomUUID} from 'node:crypto';

const extensiones = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

//guardamos las imagenes con un nombre nuevo para no pisarlas
const storage = multer.diskStorage({
    destination: 'public/uploads', 
    filename: (req, archivo, callback) => {
        callback(null, randomUUID() + extensiones[archivo.mimetype]);
    }
});

//se recibe una img de hasta 2mb en el campo imagen del formulario
export const subirImagen = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter: (req, archivo, callback) => {
        if (!extensiones[archivo.mimetype]) {
            return callback(new Error('La imagen debe ser JPG, PNG o WEBP'));
        }
        callback(null, true);
    }
}).single('imagen');
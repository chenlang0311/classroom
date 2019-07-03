import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { UploadMulter } from '../../lib/uploads';
import { config } from '../../config/config';
import { Uploads } from '../../controllers';
// import { checkLogin } from '../../lib/jwt';

const r = Router();
const router = new routerHandler(r).handler;
const uploadImg = new UploadMulter(config.imageFolderTmp, 'jpg|png|webp|BMP|bmp').upload;

router.post('/uploadimg',  uploadImg.single('uploadimg'), Uploads.uploadImage);

export default r;
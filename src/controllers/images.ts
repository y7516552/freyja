
import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';


import { ImgurClient }  from'imgur';
import multer from 'multer';
import path from 'path';

const upload = multer({
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        console.log('req',req)
        console.log('file',file)
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
        cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
      }
      cb(null, true);
    },
  }).any();

  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
});
  



export const uploadImage: RequestHandler =  async(req , res, next) => {
    upload(req, res, async () => {
        try{
            if (!req.files?.length) {
                throw createHttpError(404, '上傳失敗');
            }
    
            const response = await client.upload({
                image: req.files[0].buffer.toString('base64'),
                type: 'base64',
                album: process.env.IMGUR_ALBUM_ID
            });
            console.log("response",response)
            if(!response.success) {
                throw createHttpError(404, `上傳失敗:${response.data}`);
            }
            res.send({ 
                status: true,
                url: response.data.link 
            });
        } catch (error) {
            next(error);
        }
    })
}

export const removeImage: RequestHandler =  async(req , res, next) => {
    try{

        const imgId = req.params.id
    
        const response = await client.deleteImage(imgId);

        if(!response.success) {
            console.log(response)
            res.send({ 
                status: false,
                message: "刪除失敗" 
            });
        }
        res.send({ 
            status: true,
            message: "刪除成功" 
        });
    }catch (error) {
        next(error);
    }

}




import { Router } from 'express';
import * as ImagesController from '@/controllers/images';

const router = Router();


router.post(
    '/upload',
    ImagesController.uploadImage
);

router.delete(
    '/:id',
    ImagesController.removeImage
);

export default router;
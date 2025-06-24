import { Router } from 'express';
import { createShortUrl,  deleteShortUrl, getAnalytics, getShortUrlInfo, redirectToOriginalUrl } from '../controllers/shortUrls.controller';
import validateBody from '../middlewares/Validate.middleware';
import { CreateShortUrlBodySchema } from '../schema';

const router = Router();

router.get('/:shortUrl', redirectToOriginalUrl)
router.post('/shorten', validateBody(CreateShortUrlBodySchema), createShortUrl)
router.delete('/delete/:shortUrl', deleteShortUrl)
router.get('/info/:shortUrl', getShortUrlInfo)
router.get('/analytics/:shortUrl', getAnalytics)

export default router;

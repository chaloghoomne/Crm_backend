
import { getUrl as getGoogleUrl, handleGoogleCallback as handleCallback, handleOutlookCallback} from "../controllers/oauth.controller";

import { Router } from "express";
const router = Router();

console.log("getUrl type:", typeof getGoogleUrl);
console.log("handleGoogleCallback type:", typeof handleCallback);

router.get('/google/url/:companyId/:provider', getGoogleUrl);
router.get("/auth/google/callback",handleCallback);
router.get("/auth/outlook/callback", handleOutlookCallback);

export default router;
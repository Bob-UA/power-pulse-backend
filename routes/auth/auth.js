const express = require('express');
const current = require('../../controllers/current');
const singup = require('../../controllers/auth/singup');
const singin = require('../../controllers/auth/singin');
const logout = require('../../controllers/auth/logout');
const refresh = require('../../controllers/auth/refresh');
const auth = require('../../midlewares/auth');
const router = express.Router();

router.post('/users/register', singup);
router.post('/users/login', singin);
router.post('/users/logout',auth , logout);
router.get('/users', current);
router.post('/users/verify', refresh);
// router.patch('/users/avatars', auth, upload.single("avatar"), handlerJpg, editAvatar);
// router.get('/users/verify/:verificationToken', verifyCode);
module.exports = router;
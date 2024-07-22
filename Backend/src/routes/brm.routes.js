const express = require('express');
const router = express.Router();
const Auth = require('../middlewares/authentication');
const BmrController = require('../controllers/bmr.controllers');

router.post('/post-bmr', Auth.checkJwtToken, BmrController.postBMR);
router.put('/edit-bmr/:id', Auth.checkJwtToken, BmrController.editBMR);
router.delete('/delete-bmr/:id', Auth.checkJwtToken, BmrController.deleteBMR);
router.get('/get-all-bmr', Auth.checkJwtToken, BmrController.getAllBMR);






module.exports = router;
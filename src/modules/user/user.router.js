import { Router } from "express";
import { changePass, confirmEmail, deleteUser, getAll, refreshToken, signIn, signUp,softDelete,updateUser, forgotPassword, resetPassword, uploadImage, uploadCoverImage } from "./controller/user.controller.js";
import { asyncHandller } from './../../utlis/asyncHandler.js';
import authen from './../../middleware/auth.js';
import { validation } from "../../middleware/validation.js";
import { changePassSchema, confirmMailSchema, deleteUserSchema, forgetPassSchema, refreshTokenSchema, resetPassSchema, signInSchema, signUpSchema, softDeleteSchema, updateUserSchema, uploadProfileSchema } from "./controller/user.validation.js";
import uploadFile, { fileValidation } from './../../utlis/uploadFiles.js';
const router = Router();

//get all User
router.get("/",asyncHandller(getAll));
// sign up 
router.post("/",validation(signUpSchema),asyncHandller(signUp));
// sign in
router.post("/signin",validation(signInSchema),asyncHandller(signIn));
// change password
router.patch("/pass",validation(changePassSchema),authen,asyncHandller(changePass));
// forget password send email
router.post('/sendEmail',validation(forgetPassSchema), authen,asyncHandller(forgotPassword))
// reset password
router.patch('/resetPassword/:token',validation(resetPassSchema),asyncHandller(resetPassword))
// update user 
router.patch("/",validation(updateUserSchema),authen,asyncHandller(updateUser));
// delete user
router.delete("/",validation(deleteUserSchema),authen,asyncHandller(deleteUser));
// soft delete user 
router.delete("/softdelete",validation(softDeleteSchema),authen,asyncHandller(softDelete));
// confirm email
router.get('/confirmEmail/:token',validation(confirmMailSchema),asyncHandller(confirmEmail))
// refresh token
router.get('/refreshToken/:token',validation(refreshTokenSchema),asyncHandller(refreshToken))
//upload user photo
router.patch('/uploadImage',authen,uploadFile(
    {
        customValidation: fileValidation.image, customPath: 'user/profile'
    }
).single('image'),asyncHandller(uploadImage)); 
// upload cover image
router.patch('/coverImage',authen,uploadFile(
    {
        customValidation: fileValidation.image, customPath: 'user/cover'
    }
).array('image', 3),asyncHandller(uploadCoverImage)); 










export default router
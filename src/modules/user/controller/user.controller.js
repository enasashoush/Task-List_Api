import userModel from './../../../Db/model/User.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendEmail from './../../../utlis/email.js';


//get all User
export const getAll = async (req, res, next) => {

    const user = await userModel.find()

    return res.json({ message: 'all users', user })


}

// sign up 
export const signUp = async (req, res, next) => {
    const { email, password } = req.body

    const emailExist = await userModel.findOne({ email })

    if (emailExist) {
        return next(new Error('email already exist', { cause: 409 }))

    }

    const hashPass = bcrypt.hashSync(password, +process.env.ROUND)
    req.body.password = hashPass

    const newUser = await userModel.create(req.body)

    const token = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.CONFIRM_SIGNATURE, { expiresIn: 60 * 5 })
    const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`
    const refreshToken = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.CONFIRM_SIGNATURE, { expiresIn: 60 * 60 * 24 })
    const refreshLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${refreshToken}`

    sendEmail({
        to: newUser.email,
        subject: 'Confirm your email',
        html: `<a href="${link}">Confirm your email</a>
            <br>
            <br>
            <a href="${refreshLink}">Refresh token</a>
            `

    })

    return res.json({ message: 'user added', newUser })

}

//confirm email
export const confirmEmail = async (req, res, next) => {

    const { token } = req.params
    const payload = jwt.verify(token, process.env.CONFIRM_SIGNATURE)
    const confirm = await userModel.findOneAndUpdate({ email: payload.email }, { confirmEmail: true })
    return confirm ? res.redirect('/') : res.redirect('/')
}

//refresh token
export const refreshToken = async (req, res, next) => {
    const { token } = req.params
    const payload = jwt.verify(token, process.env.CONFIRM_SIGNATURE)
    const newToken = jwt.sign({ _id: payload._id, email: payload.email }, process.env.CONFIRM_SIGNATURE, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/user/refreshToken/${newToken}`
    const notConfirm = await userModel.findOne({ _id: payload._id, confirmEmail: false })
    if (!notConfirm) {
        return confrim ? res.redirect("/") : res.redirect("/")
    }

    sendEmail({
        to: payload.email,
        subject: 'Confirm EMAIL ',
        html: `<a href="${link}">Confirm your email</a>  `

    })

    return res.json({ message: "confirm your email" })

}

// sign in 
export const signIn = async (req, res, next) => {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
        return next(new Error('user not found', { cause: 404 }))
    }

    if (!user.confirmEmail) {
        return res.status(400).json({ message: 'Please confirm your email first' });
    }

    const isMatch = bcrypt.compareSync(password, user.password)

    if (!isMatch) {
        return next(new Error('password not match', { cause: 400 }))
    }

    user.deleted = false;
    await user.save();


    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.AUTH_SIGNATURE, { expiresIn: 60 * 60 })

    return res.json({ message: 'success', token })


}

// change password 
export const changePass = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;

    const user = await userModel.findById({ _id });

    const match = bcrypt.compareSync(oldPassword, user.password)
    if (!match) {

        return next(new Error('invalid password'), { cause: 400 });

    }

    if (!user) {
        return next(new Error('User not authorized', { cause: 401 }));
    }


    const hashPass = bcrypt.hashSync(newPassword, +process.env.ROUND);
    user.password = hashPass;
    await user.save();

    return res.json({ message: 'Password changed successfully' });


}

// Forgot password 
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error('User not found', { cause: 404 }));
    }
    const resetToken = jwt.sign({ email }, process.env.CONFIRM_SIGNATURE, { expiresIn: 60 * 30, });
    user.resetToken = resetToken;
    await user.save();
    const resetLink = `${req.protocol}://${req.headers.host}/user/resetPassword/${resetToken}`;

    sendEmail({
        to: email,
        subject: 'Reset your password',
        html: `<a href="${resetLink}">Reset your password</a>`,
    });

    return res.json({ message: 'Reset password link sent' });
};

// Reset password
export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    const payload = jwt.verify(token, process.env.CONFIRM_SIGNATURE);


    const user = await userModel.findOne({ email: payload.email });
    if (!user) {
        return next(new Error('User not found', { cause: 404 }));
    }

    const newHashedPassword = bcrypt.hashSync(password, +process.env.ROUND);
    user.password = newHashedPassword;
    user.resetToken = undefined;
    await user.save();


    return res.json({ message: 'Password reset successful' });
};

// update user done
export const updateUser = async (req, res, next) => {
    const { newFName, newLName, newAge } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }

    user.fName = req.body.newFName;
    user.lName = req.body.newLName;
    user.age = req.body.newAge;
    await user.save();
    return res.json({ message: 'user updated', user })
}

// delete user done
export const deleteUser = async (req, res, next) => {

    const user = await userModel.findByIdAndDelete(req.user._id);
    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }

    return res.json({ message: 'user deleted', user })
}

// soft delete user  done
export const softDelete = async (req, res, next) => {

    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { deleted: true },
        { new: true }
    );

    if (!user) {
        return next(new Error('User not found', { cause: 404 }));
    }

    return res.json({ message: 'User deleted', user });


}

//upload user profile picture
export const uploadImage = async (req, res, next) => {

    const {_id} =  req.user

    const user = await userModel.findByIdAndUpdate({ _id},{profilPic: req.file.finalDest}, {new: true});
    return res.json({ message: 'done', user })
}

//upload user cover picture
export const uploadCoverImage = async (req, res, next) => {

    const images = []
    req.files.forEach(element =>{
        images.push(element.finalDest);
    })
    const {_id} =  req.user

    const user = await userModel.findByIdAndUpdate({ _id},{coverPic: images}, {new: true});
    return res.json({ message: 'done', user })
    
}

















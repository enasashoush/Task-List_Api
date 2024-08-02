import jwt from 'jsonwebtoken'
import userModel from '../Db/model/User.model.js'


const authen = async (req, res, next) => {
    const { auth } = req.headers

    if (!auth) {
        return next(new Error('please login', { cause: 401 }))

    }

    if (!auth.startsWith(process.env.BEARER_KEY)) {
        return next(new Error('invalid baerer key', { cause: 404 }))


    }

    const token = auth.split(process.env.BEARER_KEY)[1]

    const payload = jwt.verify(token, process.env.AUTH_SIGNATURE)

    if (!payload?._id) {
        return next(new Error('invalid payload', { cause: 404 }))


    }

    const user = await userModel.findOne({ _id: payload._id }).select('-password')

    if (!user) {
        return next(new Error('invalid user', { cause: 404 }))
    }

    if (user.deleted == true) {
        return next(new Error('email is deleted please login again'))
    }

    req.user = user
    next()

}

export default authen
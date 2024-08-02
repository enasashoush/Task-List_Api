import connection from './Db/connection.js';
import userRouter from './modules/user/user.router.js';
import taskRouter from './modules/task/task.router.js';
import { globalError } from './utlis/asyncHandler.js';

const bootstrap = (app, express) => {

    app.use(express.json());
    app.use('/user', userRouter);
    app.use('/task', taskRouter);
    app.use(globalError);
    connection()

}

export default bootstrap;
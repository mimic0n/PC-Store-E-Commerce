import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { uploadSingle, handleMulterError } from '../middlewares/multer.js';
import { 
    resigterForUser,
    verifyUserEmail,
    LoginForUser,
    LogoutForUser,
    uploadUserAvatar,
    deleteUserAvatar,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    changePassword,
    refreshAccessToken,
    resendOTP
} from '../controllers/User.controller.js';

const userRouter = Router();

// ========== PUBLIC ROUTES (Không cần đăng nhập) ==========
userRouter.post('/register', resigterForUser);
userRouter.post('/verify-email', verifyUserEmail);
userRouter.post('/resend-otp', resendOTP);
userRouter.post('/login', LoginForUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOTP);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/refresh-token', refreshAccessToken);

// ========== PROTECTED ROUTES (Cần đăng nhập) ==========
userRouter.post('/logout', auth, LogoutForUser);
userRouter.get('/get-profile', auth, getUserProfile);
userRouter.put('/update-profile', auth, updateUserProfile);
userRouter.put('/change-password', auth, changePassword);

// Upload/Delete Avatar
userRouter.post('/post-avatar', auth, uploadSingle, handleMulterError, uploadUserAvatar);
userRouter.delete('/delete-avatar', auth, deleteUserAvatar);

export default userRouter;
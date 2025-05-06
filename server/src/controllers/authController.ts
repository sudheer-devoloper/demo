import { RequestHandler } from 'express';
import User from '../models/User';
import { generateTokens, verifyToken } from '../utils/jwt';
import { NotificationService } from '../utils/notification';
const notificationService = new NotificationService();

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, fcmToken } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = { id: user._id, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie('refreshToken', refreshToken, {httpOnly: true,sameSite: 'strict',secure: false,maxAge: 7 * 24 * 60 * 60 * 1000}); // 7 days

    if (fcmToken) {
      if (!user.fcm_token || user.fcm_token != fcmToken) {
        await User.findOneAndUpdate({ _id: user._id }, { fcm_token: fcmToken }, { new: true });
      }
      await notificationService.sendNotification(fcmToken, "Login Successful", `Welcome back, ${user?.name}!`);
    }

    res.json({
      accessToken,
      user: {
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        name: user.name,
        id: user._id
      },
    });
  } catch (error) {
    next(error);
  }
};


export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = verifyToken(token, 'refresh') as any;

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: payload.id,
      role: payload.role,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
};
import admin from '../utils/firebase';

export class NotificationService {
  async sendNotification(fcmToken: string, title: string, body: any) {
    try {
      const message = {
        token: fcmToken,
        notification: { title: title, body: body },
        data: { type: 'LOGIN_SUCCESS' },
      };
      const response = await admin.messaging().send(message);
      console.log('Notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}

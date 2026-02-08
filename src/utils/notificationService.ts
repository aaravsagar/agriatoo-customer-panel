// notificationService.ts
// Service for handling push notifications

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  public async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission denied');
        return;
      }
    }

    try {
      // Check if service worker is available
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: '/logo192.png', // Update with your app icon path
          badge: '/badge-icon.png', // Update with your badge icon path
          vibrate: [200, 100, 200],
          tag: 'order-status-update',
          requireInteraction: false,
          ...options,
        });
      } else {
        // Fallback to basic notification
        new Notification(title, options);
      }
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to basic notification
      new Notification(title, options);
    }
  }

  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }
}

export const notificationService = NotificationService.getInstance();

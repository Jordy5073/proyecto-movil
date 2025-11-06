import {Injectable, OnDestroy} from '@angular/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed
} from '@capacitor/push-notifications';
import {LocalNotifications} from '@capacitor/local-notifications';

@Injectable({providedIn: 'root'})
export class PushService implements OnDestroy {
  private listeners: Array<{ remove: () => Promise<void> }> = [];

  async init() {
    await this.ensureNotificationChannel();

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive !== 'granted') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('Permiso de notificaciones denegado');
      return;
    }

    await PushNotifications.register();

    this.listeners.push(
      await PushNotifications.addListener('registration', (token: Token) => {
        console.log('Token FCM:', token.value);
      })
    );

    this.listeners.push(
      await PushNotifications.addListener('registrationError', (error) => {
        console.error('Error en registro push:', error);
      })
    );

    this.listeners.push(
      await PushNotifications.addListener('pushNotificationReceived', (notif: PushNotificationSchema) => {
        console.log('Notificación en foreground:', notif);
      })
    );

    this.listeners.push(
      await PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        console.log('Usuario tocó notificación:', action.notification.data);

        const data = action.notification.data?.screen;
        console.log('data: ', JSON.stringify(data));
      })
    );
  }

  async ensureNotificationChannel() {
    try {
      await LocalNotifications.createChannel({
        id: 'high_importance',
        name: 'Alertas importantes',
        description: 'Canal para notificaciones de alta prioridad',
        importance: 5,
        sound: 'default'
      });

      console.log('Canal de notificación creado o ya existente');
    } catch (err) {
      console.warn('Error creando canal:', err);
    }
  }

  async ngOnDestroy() {
    console.log('Eliminando listeners de Push...');
    for (const listener of this.listeners) {
      await listener.remove();
    }
    this.listeners = [];
  }
}

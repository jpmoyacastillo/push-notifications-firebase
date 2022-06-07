import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  mensajes: PushNotificationSchema[] = [
    /* {
      title: 'Titulo 1',
      body: 'Mensaje 1',
      date: new Date(),
    }, */
  ];

  pushListener = new EventEmitter<PushNotificationSchema>();

  constructor(private router: Router, private storage: Storage) {
    this.cargarMensajes();
  }

  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  public registerPush() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        this.notificacionRecibida(notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        await this.notificacionRecibida(notification.notification);
        /* if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        } */
      }
    );
  }

  async notificacionRecibida(notification: PushNotificationSchema) {
    await this.cargarMensajes();

    const existePush = this.mensajes.find(
      (mensaje) => mensaje.id === notification.id
    );

    if (existePush) {
      return;
    }

    this.mensajes.unshift(notification);
    this.pushListener.emit(notification);
    await this.guardarMensajes();
  }

  guardarMensajes() {
    this.storage.create();
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {
    this.storage.create();
    this.mensajes = (await this.storage.get('mensajes')) || [];
    return this.mensajes;
  }

  async borrarMensajes() {
    await this.storage.clear();
    this.mensajes = [];
    this.guardarMensajes();
  }
}

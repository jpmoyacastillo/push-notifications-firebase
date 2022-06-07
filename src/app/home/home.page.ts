import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mensajes: PushNotificationSchema[] = [];

  constructor(
    public pushServive: FcmService,
    private applicationRef: ApplicationRef
  ) {}

  async ngOnInit() {
    this.pushServive.pushListener.subscribe((notification) => {
      this.mensajes.unshift(notification);
      this.applicationRef.tick();
    });
  }

  async ionViewWillEnter() {
    console.log('Will enter - Cargar mensajes');
    this.mensajes = await this.pushServive.getMensajes();
  }

  async borrarMensajes() {
    await this.pushServive.borrarMensajes();
    this.mensajes = [];
  }
}

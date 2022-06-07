import { Component, OnInit } from '@angular/core';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private pushService: FcmService) {}

  ngOnInit() {
    this.pushService.registerPush();
  }
}

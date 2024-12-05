import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Viaje } from 'src/app/interfaces/viaje';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {


  constructor(
  
  ) { }

  ngOnInit() {
  }

}

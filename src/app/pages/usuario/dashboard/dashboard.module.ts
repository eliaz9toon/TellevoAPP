import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { QrCodeModule } from 'ng-qrcode';

// Importa el TripMapModalComponent
import { TripMapModalComponent } from './../../../trip-map-modal/trip-map-modal.component';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    QrCodeModule,
  ],
  declarations: [
    DashboardPage,
    TripMapModalComponent, BarcodeScanningModalComponent  // Declara el TripMapModalComponent
  ]
})
export class DashboardPageModule {}

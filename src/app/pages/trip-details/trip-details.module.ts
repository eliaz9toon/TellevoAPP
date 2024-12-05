import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripDetailsPageRoutingModule } from './trip-details-routing.module';

import { TripDetailsPage } from './trip-details.page';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripDetailsPageRoutingModule,
    QrCodeModule
  ],
  declarations: [TripDetailsPage]
})
export class TripDetailsPageModule {}

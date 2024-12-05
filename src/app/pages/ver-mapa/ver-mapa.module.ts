import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerMapaPageRoutingModule } from './ver-mapa-routing.module';

import { VerMapaPage } from './ver-mapa.page';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerMapaPageRoutingModule,
    QrCodeModule
  ],
  declarations: [VerMapaPage]
})
export class VerMapaPageModule {}

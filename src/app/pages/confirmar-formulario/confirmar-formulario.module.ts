import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmarFormularioPageRoutingModule } from './confirmar-formulario-routing.module';

import { ConfirmarFormularioPage } from './confirmar-formulario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmarFormularioPageRoutingModule
  ],
  declarations: [ConfirmarFormularioPage]
})
export class ConfirmarFormularioPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmarFormularioPage } from './confirmar-formulario.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarFormularioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmarFormularioPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioConductorPage } from './formulario-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioConductorPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetContraPage } from './reset-contra.page';

const routes: Routes = [
  {
    path: '',
    component: ResetContraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetContraPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'bitacora',
        component: BitacoraComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }

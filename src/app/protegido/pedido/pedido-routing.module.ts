import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { AtencionComponent } from './pages/atencion/atencion.component';
import { CocinaComponent } from './pages/cocina/cocina.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'atencion',
        component: AtencionComponent
      },
      {
        path: 'cocina',
        component: CocinaComponent
      },
      {
        path: '**',
        redirectTo: 'atencion'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }

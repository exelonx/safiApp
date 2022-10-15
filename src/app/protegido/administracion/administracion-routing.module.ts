import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        component: UsuarioComponent
      },
      {
        path: 'bitacora',
        component: BitacoraComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }

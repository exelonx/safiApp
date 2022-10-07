import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
 
import { AuthRoutingModule } from './auth-routing.module'; 
import { LoginComponent } from './pages/login/login.component'; 
import { RegistroComponent } from './pages/registro/registro.component'; 
import { MainComponent } from './pages/main/main.component'; 
import { CarouselComponent } from './pages/carousel/carousel.component'; 
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena.component';
import { PreguntaSecretaComponent } from './pages/pregunta-secreta/pregunta-secreta.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { CambioPorCorreoComponent } from './pages/cambio-por-correo/cambio-por-correo.component';
import { PreguntasConfigComponent } from './pages/preguntas-config/preguntas-config.component';
import { PreguntaFormularioComponent } from './pages/preguntas-config/components/pregunta-formulario/pregunta-formulario.component';

import { NgMaterialModule } from '../ng-material/ng-material.module'; 
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './pages/login/components/loader/loader.component';
 
@NgModule({ 
  declarations: [ 
    LoginComponent, 
    RegistroComponent, 
    MainComponent, 
    CarouselComponent,
    CambioContrasenaComponent,
    PreguntaSecretaComponent,
    RecuperarContrasenaComponent,
    CambioPorCorreoComponent,
    PreguntasConfigComponent,
    PreguntaFormularioComponent,
    LoaderComponent
  ], 
  imports: [ 
    CommonModule, 
    AuthRoutingModule, 
    NgMaterialModule,
    ReactiveFormsModule 
  ],
  exports: [
    CambioContrasenaComponent
  ] 
}) 
export class AuthModule { }
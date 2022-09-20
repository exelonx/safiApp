import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
 
import { AuthRoutingModule } from './auth-routing.module'; 
import { LoginComponent } from './pages/login/login.component'; 
import { RegistroComponent } from './pages/registro/registro.component'; 
import { MainComponent } from './pages/main/main.component'; 
import { LoginBoxComponent } from './pages/login/components/login-box/login-box.component'; 
import { CarouselComponent } from './pages/login/components/carousel/carousel.component'; 
import { NgMaterialModule } from '../ng-material/ng-material.module'; 
import { CambioContrasenaComponent } from './pages/cambio-contrasena/cambio-contrasena.component';
 
 
@NgModule({ 
  declarations: [ 
    LoginComponent, 
    RegistroComponent, 
    MainComponent, 
    LoginBoxComponent, 
    CarouselComponent,
    CambioContrasenaComponent
  ], 
  imports: [ 
    CommonModule, 
    AuthRoutingModule, 
    NgMaterialModule 
  ] 
}) 
export class AuthModule { }
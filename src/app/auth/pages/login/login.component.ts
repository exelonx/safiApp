import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  // Propiedad para Angular Material de tipo Password
  hide: boolean = true;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  // Subscripción al login              
  private loginSubscripcion!: Subscription;

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService,
               private loader: LoaderService ) { }

  // Formulario
  formularioLogin: FormGroup = this.fb.group({
    usuario:    ['LaReina', [Validators.required, Validators.maxLength(15)]],
    contrasena: ['Hol@12345', [Validators.required, Validators.minLength(1)]]
  })

  login() {

    // Extraer los datos del formulario de login
    const { usuario, contrasena } = this.formularioLogin.value;
    
    if( !this.enEjecucion ) { // Evitar que se ejecute más de una vez

      this.enEjecucion = true;  // Varibale para lockear botón

      // Subscripciones
      let subscripcionTrue!: Subscription;
      let subscripcionFalse!: Subscription;

      // Variable para ocultar el carrusel
      subscripcionTrue = this.loader.ejecutandoLogin(true).subscribe()
      // console.log(this.loader.enEjecucion)

      // Consumir API de logeo
      this.loginSubscripcion = this.authService.login( usuario, contrasena )
        .subscribe( resp => {
          if( resp === true ) {
            // Login exitoso
            this.router.navigateByUrl( '/main' )
            setTimeout(() => {
              subscripcionFalse = this.loader.ejecutandoLogin(false).subscribe()
              subscripcionFalse.unsubscribe();
            }, 1000);
          } else {
            this.enEjecucion = false;
            Swal.fire('Error', resp, 'error')
            // Variable para restaurar el carrusel
            subscripcionFalse = this.loader.ejecutandoLogin(false).subscribe()
            subscripcionTrue.unsubscribe();
          }
        })
    }

  } 

  ngOnDestroy(): void {
    
    // Eliminar subscripción de login al destruir el componente
    if( this.loginSubscripcion ){
      this.loginSubscripcion.unsubscribe();
    }
    
  }
  
  ngOnInit(): void {
  }


}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  // Propiedad para Angular Material de tipo Password
  hide = true;

  // Subscripción al login              
  private loginSubscripcion!: Subscription;

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService ) { }

  // Formulario
  formularioLogin: FormGroup = this.fb.group({
    usuario:    ['LaReina', [Validators.required, Validators.maxLength(15)]],
    contrasena: ['L@Rein4!', [Validators.required, Validators.minLength(1)]]
  })

  login() {

    // Extraer los datos del formulario de login
    const { usuario, contrasena } = this.formularioLogin.value;

    // Consumir API de logeo
    this.loginSubscripcion = this.authService.login( usuario, contrasena )
      .subscribe( resp => {
        if( resp === true ) {
          // Login exitoso
          this.router.navigateByUrl( '/main' )
        } else {
          Swal.fire('Error', resp, 'error')
        }
      })
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

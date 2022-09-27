import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent implements OnInit, OnDestroy {

  //Subscripciones
  emailSubscripcion!: Subscription;
  preguntaSubscripcion!: Subscription;

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService ) { }

  // Formulario
  formularioRecuperacion: FormGroup = this.fb.group({
    usuario:    ['', [Validators.required, Validators.maxLength(15), Validators.minLength(1)]]
  })

  // Método de recuperación por email
  sendCorreoRecuperacion() {

    // Extraer los datos del formulario de recuperación
    const { usuario } = this.formularioRecuperacion.value;

    // Consumir API de solicitud de email
    this.emailSubscripcion = this.authService.solicitarCorreoRecuperacion( usuario )
      .subscribe( resp => {
        if( resp.ok === true ) {
          // Correo se envió con éxito
          Swal.fire('¡Éxito!', resp.msg , 'success')
        } else {
          // Error con el usuario
          Swal.fire('Error', resp, 'error')
        }
      })

  }

  // Método de recuperación por pregunta secreta
  validarUsuario() {

    // Extraer los datos del formulario de recuperación
    const { usuario } = this.formularioRecuperacion.value;

    // Consumir API de solicitud de email
    this.preguntaSubscripcion = this.authService.validarUsuarioRecovery( usuario )
      .subscribe( resp => {
        if( resp.ok === true ) {
          // Se encontro el usuario
          this.router.navigateByUrl(`/auth/pregunta-secreta/${resp.token}`)
        } else {
          // Error con el usuario
          Swal.fire('Error', resp, 'error')
        }
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

      // Eliminar subscripción de email al destruir el componente
      if( this.emailSubscripcion ) {
        this.emailSubscripcion.unsubscribe();
      }

      // Eliminar subscripción de la API de validar Usuarios
      if( this.preguntaSubscripcion ) {
        this.preguntaSubscripcion.unsubscribe();
      }
  }
}

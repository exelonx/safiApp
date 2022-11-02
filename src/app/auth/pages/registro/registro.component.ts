import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { HasElementRef } from '@angular/material/core/common-behaviors/color';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  // Formulario
  formularioRegistro: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    usuario: ['', [Validators.required, Validators.maxLength(15)]],
    contrasena: ['', [Validators.required]],
    confirmContrasena: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
  })

  // Subscripción
  registroSubs!: Subscription;

  // para los iconos de contraseña
  hideContrasena: boolean = true;
  hideVerificar: boolean = true;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  registrar() {

    const { nombre, usuario, contrasena, confirmContrasena, correo } = this.formularioRegistro.value;

    if( !this.enEjecucion ) { // Evitar que se ejecute más de una vez

      this.enEjecucion = true
      
      this.authService.registro(nombre, usuario, contrasena, confirmContrasena, correo)
        .subscribe(resp => {
          if (resp.ok === true) {
            // Registro exitoso
            Swal.fire({
              title: '¡Éxito!',
              text: resp.msg,
              icon: 'success',
              iconColor: 'white',
              background: '#a5dc86',
              color: 'white',
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 4500,
              timerProgressBar: true,
            })
            this.router.navigateByUrl('/auth/login')
          } else {
            // Registro sin éxito
            this.enEjecucion = false
            Swal.fire({
              title: 'Error',
              text: resp,
              icon: 'error',
              iconColor: 'white',
              background: '#d12609',
              color: 'white',
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 4500,
              timerProgressBar: true,
            })
          }
        })

    }
  }

  // TODO: PARA PONER EN MAYÚSCULA LAS COSAS QUE EL LIC PIDIO :c
  toMayus(formControl: string) {
    
    // SUPER TODO: CAMBIAR EL FORMULARIO QUE USARAN EN ESTE MÉTODO >:C

    // Extraser el valor del control del formulario
    const valorFormulario = this.formularioRegistro.controls[formControl].value
    // Pasarlo a Mayúscula
    this.formularioRegistro.controls[formControl].setValue(valorFormulario.toUpperCase()) 

  }

  ngOnDestroy(): void {
    // Eliminar subscripción de login al destruir el componente
    if( this.registroSubs ){
      this.registroSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-por-correo',
  templateUrl: './cambio-por-correo.component.html',
  styleUrls: ['./cambio-por-correo.component.css']
})
export class CambioPorCorreoComponent implements OnInit {

  hideContra: boolean = true;
  hideRepetir: boolean = true;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  constructor( private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  // Forlumario
  formCambioContrasena: FormGroup = this.fb.group({
    nuevaContrasena:      ['', [Validators.required]],
    confirmarContrasena:  ['', [Validators.required]]
  })
  

  actualizarContrasena() {

    // Extraer los datos del formulario de login
    const { nuevaContrasena, confirmarContrasena } = this.formCambioContrasena.value;
    // Traer el ID del servicio
    const id_usuario = this.authService.idUsuario;

    if( !this.enEjecucion ) { // Evitar que se ejecute más de una vez

      this.enEjecucion = true
      // Consumir API
      this.authService.actualizarContrasena( nuevaContrasena, confirmarContrasena, id_usuario!, id_usuario! )
        .subscribe( resp => {
          if ( resp.ok === true ) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Contraseña actualizada con éxito',
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
            this.enEjecucion = false
            Swal.fire({
              title: 'Error',
              text: resp.msg,
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

  ngOnInit(): void {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.css']
})
export class CambioContrasenaComponent implements OnInit {

  hideContra: boolean = true;
  hideRepetir: boolean = true;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  @Input() cambioPorConfigPregunta: boolean = false; // Ocultara el boton de cerrar si se esta desde la pantalla de configuración de contraseña

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

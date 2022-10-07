import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-contrasena-perfil',
  templateUrl: './cambio-contrasena-perfil.component.html',
  styleUrls: ['./cambio-contrasena-perfil.component.css']
})
export class CambioContrasenaPerfilComponent implements OnInit {

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
            Swal.fire('¡Éxito!', 'Contraseña actualizada con éxito', 'success');
            this.router.navigateByUrl('/auth/login')
          } else {
            this.enEjecucion = false
            Swal.fire('Error', resp.msg, 'warning');
          }
        })

    }
  }

  ngOnInit(): void {
  }

}

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

    this.authService.actualizarContrasena( nuevaContrasena, confirmarContrasena, id_usuario!, id_usuario! )
      .subscribe( resp => {
        if ( resp.ok === true ) {
          Swal.fire('¡Éxito!', 'Contraseña actualizada con éxito', 'success');
          this.router.navigateByUrl('/auth/login')
        } else {
          Swal.fire('Error', resp.msg, 'warning');
        }
      })
  }

  ngOnInit(): void {
  }

}

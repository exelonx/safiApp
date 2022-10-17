import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { PerfilUsuarioService } from './services/perfil-usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  get usuario() {
    return this.authService.usuario;
  }

  subscripcionCambioCorreo!: Subscription;
  subscripcionCambioNombre!: Subscription;
  subscripcionCambioContra!: Subscription;

  constructor(private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private perfilService: PerfilUsuarioService) { }

  panelOpenState = false;
  hideContra: boolean = true;
  hideRepetir: boolean = true;
  hideContraVerifi: boolean = true;

  // Formulario
  formularioCorreo: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
  })

  formularioNombre: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]]
  })

  formularioContra: FormGroup = this.fb.group({
    contrasena: ['', [Validators.required]],
    confirmContrasena: ['', [Validators.required]],
    confirmContrasenaActual: ['', [Validators.required]],
  })

  actualizarCorreo() {
    const id_usuario = this.authService.usuario.id_usuario;
    const {correo} = this.formularioCorreo.value;
    this.subscripcionCambioCorreo = this.perfilService.actualizarUsuario(id_usuario, undefined , correo, id_usuario, 13)
      .subscribe(resp => {
        console.log(resp);
        if(resp.ok === true) {
          Swal.fire('¡Éxito!', resp.msg, 'success')
        } else {
          Swal.fire('Error', resp, 'warning')
        }
      })
  }

  actualizarNombre() {
    const id_usuario = this.authService.usuario.id_usuario;
    const {nombre} = this.formularioNombre.value;
    this.subscripcionCambioNombre = this.perfilService.actualizarUsuario(id_usuario, nombre.toUpperCase() , undefined , id_usuario, 13)
      .subscribe(resp => {
        console.log(resp);
        if(resp.ok === true) {
          Swal.fire('¡Éxito!', resp.msg, 'success')
        } else {
          Swal.fire('Error', resp, 'warning')
        }
      })
  }

  actualizarContrasena() {
    const id_usuario = this.authService.usuario.id_usuario;
    const {contrasena, confirmContrasena, confirmContrasenaActual} = this.formularioContra.value;
    this.subscripcionCambioContra = this.perfilService.actualizarContrasena(id_usuario, contrasena, confirmContrasena, confirmContrasenaActual)
      .subscribe(resp => {
        console.log(resp);
        if(resp.ok === true) {
          Swal.fire('¡Éxito!', resp.msg, 'success')
        } else {
          Swal.fire('Error', resp, 'warning')
        }
      })
  }

  ngOnInit(): void {
  }
}

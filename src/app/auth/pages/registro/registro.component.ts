import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

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

  registrar() {

    const { nombre, usuario, contrasena, confirmContrasena, correo } = this.formularioRegistro.value;

    this.authService.registro(nombre, usuario, contrasena, confirmContrasena, correo)
      .subscribe(resp => {
        if (resp.ok === true) {
          // Registro exitoso
          Swal.fire('¡Éxito!', resp.msg, 'success')
          this.router.navigateByUrl('/auth/login')
        } else {
          // Registro sin éxito
          console.log(resp)
          Swal.fire('Error', resp, 'error')
        }
      })
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

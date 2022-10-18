import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { PerfilUsuarioService } from './services/perfil-usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/auth/interfaces/Usuario.interface';
import { IngresosService } from '../services/ingresos.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {

  usuario!: Usuario;

  // Controlador de los acordiones
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  subscripcionCambioCorreo!: Subscription;
  subscripcionCambioNombre!: Subscription;
  subscripcionCambioContra!: Subscription;
  ingreso!: Subscription;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private perfilService: PerfilUsuarioService,
    private ingresosService: IngresosService
  ) { }

  // Formulario para los inputs
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
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.subscripcionCambioCorreo = this.perfilService.actualizarUsuario(id_usuario, undefined , correo, id_usuario, 13)
      .subscribe(resp => {
        if(resp.ok === true) {
            this.accordion.closeAll();
            this.formularioCorreo.reset() // Limpiar formulario
            this.usuario.correo = correo.toLowerCase()  // Actualizar correo en la vista
            this.enEjecucion = false // pongo 2 porque la wea es asincrona
            Swal.fire('¡Éxito!', resp.msg, 'success')
          } else {
            this.enEjecucion = false // pongo 2 porque la wea es asincrona
            Swal.fire('Error', resp, 'warning')
          }
        })

    }
  }

  actualizarNombre() {
    const id_usuario = this.authService.usuario.id_usuario;
    const {nombre} = this.formularioNombre.value;

    if( !this.enEjecucion ) {
    
    this.enEjecucion = true
      
    this.subscripcionCambioNombre = this.perfilService.actualizarUsuario(id_usuario, nombre.toUpperCase() , undefined , id_usuario, 13)
      .subscribe(resp => {
        if(resp.ok === true) {
            this.accordion.closeAll();
            this.formularioNombre.reset() // Limpiar formulario
            this.usuario.nombre = nombre.toUpperCase(); // Actualizar nombre en la vista
            this.authService.nombreMutable = nombre.toUpperCase(); // Actualizar nombre en la vista
            this.enEjecucion = false // pongo 2 porque la wea es asincrona
            Swal.fire('¡Éxito!', resp.msg, 'success')
          } else {
            this.enEjecucion = false
            Swal.fire('Error', resp, 'warning')
          }
        })
    }
  }

  actualizarContrasena() {

    const id_usuario = this.authService.usuario.id_usuario;
    const {contrasena, confirmContrasena, confirmContrasenaActual} = this.formularioContra.value;

    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

    this.subscripcionCambioContra = this.perfilService.actualizarContrasena(id_usuario, contrasena, confirmContrasena, confirmContrasenaActual)
      .subscribe(resp => {
        if(resp.ok === true) {
          this.accordion.closeAll();
          this.formularioContra.reset()
          this.formularioContra.clearValidators()
          Swal.fire('¡Éxito!', resp.msg, 'success')
          this.enEjecucion = false
        } else {
          Swal.fire('Error', resp, 'warning')
          this.enEjecucion = false
        }
      })
    }
  }

  ngOnInit(): void {
    // Inicializar usuario
    this.usuario = this.authService.usuario;

    // Registrar ingreso
    this.registrarIngreso();
  }

  ngOnDestroy(): void {
    if(this.subscripcionCambioContra) {
      this.subscripcionCambioContra.unsubscribe();
    }
    if(this.subscripcionCambioCorreo) {
      this.subscripcionCambioCorreo.unsubscribe();
    }
    if(this.subscripcionCambioNombre) {
      this.subscripcionCambioNombre.unsubscribe();
    }
    if(this.ingreso) {
      this.ingreso.unsubscribe();
    }
  }

  registrarIngreso() {

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(this.usuario.id_usuario, 13)
      .subscribe();

  }
}

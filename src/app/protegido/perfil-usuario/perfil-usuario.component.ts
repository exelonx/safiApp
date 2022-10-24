import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { PerfilUsuarioService } from './services/perfil-usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/auth/interfaces/Usuario.interface';
import { IngresosService } from '../services/ingresos.service';
import { Pregunta } from './interface/perfil.interface';
import { RolService } from '../seguridad/pages/rol/services/rol.service';
import { Rol } from '../seguridad/pages/rol/interfaces/rolItems.interface';
import { PreguntaListaTotal } from '../../auth/interfaces/PreguntaLista.interface';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {

  usuario!: Usuario;
  preguntas: Pregunta[] = [];
  listaPreguntas: PreguntaListaTotal[] = [];

  // Controlador de los acordiones
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('editarNombre') btnEditarNombre!: MatButton;
  @ViewChild('editarEmail') btnEditarEmail!: MatButton;

  subscripcionCambioCorreo!: Subscription;
  subscripcionCambioNombre!: Subscription;
  subscripcionCambioContra!: Subscription;
  ingreso!: Subscription;
  rolesSubs!: Subscription;
  preguntaSubs!: Subscription;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  // Spinners
  cambiandoNombre:  boolean  =  false;
  cambiandoEmail :  boolean  =  false;
  cambiandoContra:  boolean  =  false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private perfilService: PerfilUsuarioService,
    private ingresosService: IngresosService,
    private rolService: RolService
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
    
      this.enEjecucion = true;
      this.cambiandoEmail = true;

      this.subscripcionCambioCorreo = this.perfilService.actualizarUsuario(id_usuario, undefined , correo, id_usuario, 13)
      .subscribe(resp => {

        if(resp.ok === true) {
            this.formularioCorreo.reset() // Limpiar formulario
            this.usuario.correo = correo.toLowerCase()  // Actualizar correo en la vista
            this.enEjecucion = false // pongo 2 porque la wea es asincrona
            this.cambiandoEmail = false; // Apagando spinner
            Swal.fire('¡Éxito!', resp.msg, 'success')
          } else {
            this.enEjecucion = false // pongo 2 porque la wea es asincrona
            this.cambiandoEmail = false; // Apagando spinner
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
    this.cambiandoNombre = true
      
    this.subscripcionCambioNombre = this.perfilService.actualizarUsuario(id_usuario, nombre.toUpperCase() , undefined , id_usuario, 13)
      .subscribe(resp => {
        if(resp.ok === true) {
            this.formularioNombre.reset() // Limpiar formulario
            this.usuario.nombre = nombre.toUpperCase(); // Actualizar nombre en la vista
            this.authService.nombreMutable = nombre.toUpperCase(); // Actualizar nombre en la vista
            this.enEjecucion = false // pongo 2 porque la wea es asincrona
            this.cambiandoNombre = false // Ocultando Spinner de nuevo
            this.btnEditarNombre._elementRef.nativeElement.click()
            Swal.fire('¡Éxito!', resp.msg, 'success')
          } else {
            this.enEjecucion = false
            this.cambiandoNombre = false // Ocultando Spinner de nuevo
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
      this.cambiandoContra = true

    this.subscripcionCambioContra = this.perfilService.actualizarContrasena(id_usuario, contrasena, confirmContrasena, confirmContrasenaActual)
      .subscribe(resp => {
        if(resp.ok === true) {
          this.accordion.closeAll();
          this.usuario.fecha_vencimiento = resp.fechaVencimiento
          this.formularioContra.reset()
          this.formularioContra.clearValidators()
          Swal.fire('¡Éxito!', resp.msg, 'success')
          this.enEjecucion = false
          this.cambiandoContra = false
        } else {
          Swal.fire('Error', resp, 'warning')
          this.enEjecucion = false
          this.cambiandoContra = false
        }
      })
    }
  }

  
  
  registrarIngreso() {
    
    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(this.usuario.id_usuario, 13)
    .subscribe();
    
  }
  
  cargarPreguntas(){
    const id_usuario = this.authService.usuario.id_usuario;
    
    this.preguntaSubs = this.perfilService.cargarPreguntasUsuario(id_usuario)
    .subscribe(resp => {
      this.preguntas = resp;
    })
  }

  cargarAllPregutas() {
    // Consumo
    this.perfilService.cargarPreguntas()
      .subscribe( resp => {

        this.listaPreguntas = this.perfilService.listaPreguntas

      })
  }

  toMayus(formulario: FormGroup, formControl: string) { 
    
    if(formulario.controls[formControl].value) {

      // Extraser el valor del control del formulario
      const valorFormulario = formulario.controls[formControl].value
      // Pasarlo a Mayúscula
      formulario.controls[formControl].setValue(valorFormulario.toUpperCase()) 

    }

  }

  ngOnInit(): void {
    // Inicializar usuario
    this.usuario = this.authService.usuario;
  
    // Registrar ingreso
    this.registrarIngreso();
  
    this.cargarPreguntas();

    this.cargarAllPregutas()
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
    if(this.rolesSubs) {
      this.rolesSubs.unsubscribe();
    }
    if(this.preguntaSubs) {
      this.preguntaSubs.unsubscribe();
    }
  }

}

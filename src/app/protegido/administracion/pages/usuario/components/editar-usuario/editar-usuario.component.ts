import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Rol } from 'src/app/protegido/seguridad/pages/rol/interfaces/rolItems.interface';
import { RolService } from 'src/app/protegido/seguridad/pages/rol/services/rol.service';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { InputMayus } from 'src/app/helpers/input-mayus';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit, OnDestroy {

  // Instancias de elementos HTML
  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('selectEstado') selectEstado!: MatSelect;
  @ViewChild('inputRol') inputRol!: MatSelect;
  @ViewChild('inputCorreo') inputCorreo!: ElementRef;
  @ViewChild('inputNombre') inputNombre!: ElementRef;

  @Input() id: number = 0;
  @Input() usuario: string = "";
  @Input() nombre: string = "";
  @Input() correo: string = "";
  @Input() idRol: number = 0;
  @Input() estadoActual: string = "";

  @Input() contrasenaGenerada: string = "";

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  rolSubscripcion!: Subscription;
  usersSubscripcion!: Subscription;
  generadorSubs!: Subscription;

  // Lista de roles
  roles: Rol[] = [];

  // Formularios
  formularioContrasena: FormGroup = this.fb.group({
    contrasena: ['',[Validators.required]]
  })

  constructor( private usuarioServices: UsuarioService, private rolServices: RolService, private authService: AuthService, private fb: FormBuilder) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.cargarRoles()
  }

  cargarRoles() {
    const id_usuario = this.authService.usuario.id_usuario
    this.rolSubscripcion = this.rolServices.getRoles(id_usuario, "", "99999")
      .subscribe(
        resp => {
          this.roles = resp.roles!
        }
      )
  }

  actualizar() {
    console.log(this.inputCorreo)
    let correo = this.inputCorreo.nativeElement.value
    let nombre = this.inputNombre.nativeElement.value
    let rol = this.inputRol.value
    // let {nombre, correo, rol} = this.formularioEdicion.value
    const id_usuario: number = this.authService.usuario.id_usuario;
    let estado!: string

    // El selet tiene un ng-if, si no cargo, es porque el estado es NUEVO,
    // Si se cargo en la pantalla la variable estado recibe el valor del estado actual
    if( !this.selectEstado ) {
      estado = "NUEVO"
    } else {
      estado = this.selectEstado.value
    }
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.usuarioServices.actualizarUsuario(this.id, nombre.toUpperCase(), correo, rol, estado, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.enEjecucion = false
              this.cerrarEditar._elementRef.nativeElement.click()
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
            } else {
              this.enEjecucion = false
              Swal.fire({
                title: 'Advertencia',
                text: resp,
                icon: 'warning',
                iconColor: 'white',
                background: '#f8bb86',
                color: 'white',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 4500,
                timerProgressBar: true,
              })
            }
          })
        )
    }
  };

  generarPassword() {

    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.usuarioServices.generarPassword()
        .subscribe(
          resp => {
            this.enEjecucion = false
            this.contrasenaGenerada = resp
            this.formularioContrasena.value.contrasena = resp
            // Validar formulario
            this.formularioContrasena.controls['contrasena'].setValue(resp)
            this.formularioContrasena.controls['contrasena'].updateValueAndValidity()
          }
        )
    }
  }

  actualizarPassword() {
    const contrasena = this.formularioContrasena.value.contrasena
    const id_usuario = this.authService.usuario.id_usuario;

    if( !this.enEjecucion ) {
    
      this.enEjecucion = true
      this.cambiandoContra = true

      this.usuarioServices.actualizarContrasena(this.id, contrasena, id_usuario)
        .subscribe(
          resp => {
            if(resp.ok === true) {
              this.contrasenaGenerada = "";
              this.enEjecucion = false
              this.cambiandoContra = false
              this.onActualizacion.emit();
              this.cerrarEditar._elementRef.nativeElement.click()
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
            } else {
              this.enEjecucion = false
              this.cambiandoContra = false
              Swal.fire({
                title: 'Advertencia',
                text: resp,
                icon: 'warning',
                iconColor: 'white',
                background: '#f8bb86',
                color: 'white',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 4500,
                timerProgressBar: true,
              })
            }
          }
        )
    }
  }

  toMayus = InputMayus.toMayusNoReactivo;

  limpiarFormularios() {
    this.contrasenaGenerada = "";
    this.formularioContrasena.reset();

    

  }
  
}

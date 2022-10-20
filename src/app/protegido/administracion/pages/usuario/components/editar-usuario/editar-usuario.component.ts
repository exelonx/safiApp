import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild } from '@angular/core';
import { Rol } from 'src/app/protegido/seguridad/pages/rol/interfaces/rolItems.interface';
import { RolService } from 'src/app/protegido/seguridad/pages/rol/services/rol.service';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit, OnDestroy {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;

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
  formularioEdicion: FormGroup = this.fb.group({
    nombre: ['', ],
    correo: ['', ],
    rol: ['', ],
    estado: ['', ]
  })

  // Formularios
  formularioContrasena: FormGroup = this.fb.group({
    contrasena: ['',[Validators.required]]
  })

  constructor( private usuarioServices: UsuarioService, private rolServices: RolService, private authService: AuthService, private fb: FormBuilder) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.cargarPreguntas()
  }

  cargarPreguntas() {
    const id_usuario = this.authService.usuario.id_usuario
    this.rolSubscripcion = this.rolServices.getRoles(id_usuario, "", "99999")
      .subscribe(
        resp => {
          this.roles = resp.roles!
        }
      )
  }

  actualizar() {
    let {nombre, correo, estado, rol} = this.formularioEdicion.value
    const id_usuario = this.authService.usuario.id_usuario;
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      if( this.estadoActual === 'NUEVO' ) {
        estado = 'NUEVO'
      }

      this.usuarioServices.actualizarUsuario(this.id, nombre.toUpperCase(), correo, rol, estado, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.enEjecucion = false
              this.cerrarEditar._elementRef.nativeElement.click()
              Swal.fire('¡Éxito!', resp.msg, 'success')
            } else {
              this.enEjecucion = false
              Swal.fire('Error', resp, 'warning')
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
              Swal.fire('¡Éxito!', resp.msg, 'success')
            } else {
              this.enEjecucion = false
              this.cambiandoContra = false
              Swal.fire('Error', resp, 'warning')
            }
          }
        )
    }
  }

  limpiarContrasena() {
    this.contrasenaGenerada = "";
    this.formularioContrasena.reset();
  }
  
}

import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Rol } from 'src/app/protegido/seguridad/pages/rol/interfaces/rolItems.interface';
import { RolService } from 'src/app/protegido/seguridad/pages/rol/services/rol.service';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit, OnDestroy {

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
    contrasena: ['', [Validators.minLength(1)]]
  })

  constructor( private usuarioServices: UsuarioService, private rolServices: RolService, private authService: AuthService, private fb: FormBuilder) { }
  ngOnDestroy(): void {
    console.log('hola')
  }

  ngOnInit(): void {
    this.cargarPreguntas()
  }

  cargarPreguntas() {
    const id_usuario = this.authService.usuario.id_usuario
    console.log(this.estadoActual)
    this.rolSubscripcion = this.rolServices.getRoles(id_usuario, "", "99999")
      .subscribe(
        resp => {
          this.roles = resp.roles!
        }
      )
  }

  actualizar() {
    const {nombre, correo, estado, rol} = this.formularioEdicion.value
    const id_usuario = this.authService.usuario.id_usuario;
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.usuarioServices.actualizarUsuario(this.id, nombre.toUpperCase(), correo, rol, estado, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.enEjecucion = false
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
          }
        )
    }
  }

  actualizarPassword() {
    const contrasena = this.formularioContrasena.value.contrasena === "" ? this.contrasenaGenerada : this.formularioContrasena.value.contrasena
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
  }
  
}

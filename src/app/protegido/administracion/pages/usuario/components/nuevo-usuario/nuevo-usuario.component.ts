import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { Rol } from 'src/app/protegido/seguridad/pages/rol/interfaces/rolItems.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../../../../seguridad/pages/rol/services/rol.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit, OnDestroy {

  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;
  @ViewChild('inputContrasena') inputContrasena: any;

  contrasenaGenerada: string = "";

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
  formularioCreacion: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    usuario: ['', [Validators.required, Validators.maxLength(15)]],
    correo: ['', [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    rol: ['', [Validators.required]],
    contrasena: ['', [Validators.required]]
  })

  constructor( private usuarioServices: UsuarioService, private rolServices: RolService, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarRoles()
  }

  ngOnDestroy(): void {
    if(this.rolSubscripcion) {
      this.rolSubscripcion.unsubscribe();
    }
    if(this.usersSubscripcion) {
      this.usersSubscripcion.unsubscribe();
    }
    if(this.generadorSubs) {
      this.generadorSubs.unsubscribe();
    }
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

  crearUsuario() {
    if( !this.enEjecucion ) {
      const {usuario, nombre, correo, contrasena, rol} = this.formularioCreacion.value
      const id_usuario = this.authService.usuario.id_usuario;
    
      this.enEjecucion = true;
      this.cambiandoContra = true;

      this.usersSubscripcion = this.usuarioServices.crearUsuario(usuario.toUpperCase(), nombre.toUpperCase(), contrasena, rol, correo, id_usuario)
        .subscribe(resp => {
          this.onActualizacion.emit();
          if(resp.ok === true) {
            this.enEjecucion = false
            this.cambiandoContra = false;
            this.cerrarCrear._elementRef.nativeElement.click()
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
            this.cambiandoContra = false;
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
    }
  }

  generarPassword() {
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true
      
      this.generadorSubs = this.usuarioServices.generarPassword()
        .subscribe(
          resp => {
            this.enEjecucion = false
            this.contrasenaGenerada = resp
            this.formularioCreacion.value.contrasena = resp
            // Validar formulario
            this.formularioCreacion.controls['contrasena'].setValue(resp)
            this.formularioCreacion.controls['contrasena'].updateValueAndValidity()
            }
          )
        }
  }

  toMayus(formControl: string) {
    
    // Extraser el valor del control del formulario
    const valorFormulario = this.formularioCreacion.controls[formControl].value
    // Pasarlo a Mayúscula
    this.formularioCreacion.controls[formControl].setValue(valorFormulario.toUpperCase()) 

  }

  limpiarFormulario() {
    this.contrasenaGenerada = ""
    this.formularioCreacion.reset();
  }

}

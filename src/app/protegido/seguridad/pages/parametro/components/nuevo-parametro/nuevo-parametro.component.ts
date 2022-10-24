import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Rol } from '../../../rol/interfaces/rolItems.interface';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { UsuarioService } from '../../../../../administracion/pages/usuario/services/usuario.service';
import { RolService } from '../../../rol/services/rol.service';
import { AuthService } from '../../../../../../auth/services/auth.service';

@Component({
  selector: 'app-nuevo-parametro',
  templateUrl: './nuevo-parametro.component.html',
  styleUrls: ['./nuevo-parametro.component.css']
})
export class NuevoParametroComponent implements OnInit {

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

  // Formulario
  formularioParametro: FormGroup = this.fb.group({
    valor:    ['', [Validators.required, Validators.maxLength(100)]],
    Parametro: ['', [Validators.required, Validators.maxLength(50)]]
  })

  constructor( private usuarioServices: UsuarioService, private rolServices: RolService, private authService: AuthService, private fb: FormBuilder) { }

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
            Swal.fire('¡Éxito!', resp.msg, 'success')
          } else {
            this.enEjecucion = false
            this.cambiandoContra = false;
            Swal.fire('Error', resp, 'warning')
          }
        })
    }
  }

  generarPassword() {
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true
      
      this.usuarioServices.generarPassword()
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

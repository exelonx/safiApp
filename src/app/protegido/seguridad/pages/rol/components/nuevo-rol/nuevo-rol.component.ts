import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-nuevo-rol',
  templateUrl: './nuevo-rol.component.html',
  styleUrls: ['./nuevo-rol.component.css']
})
export class NuevoRolComponent implements OnInit {

  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  // Formulario
  formularioRol: FormGroup = this.fb.group({
    rol:    ['', [Validators.required, Validators.maxLength(30)]],
    descripcion: ['', [Validators.required, Validators.maxLength(100)]]
  })

  constructor( private rolService: RolService, private authService: AuthService, private fb: FormBuilder) { }
  
  
  crearRol() {
    if( !this.enEjecucion ) {
      const {rol, descripcion} = this.formularioRol.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.rolService.crearRol(rol, descripcion, id_usuario)
      .subscribe(resp => {
        this.onCrear.emit();
        if(resp.ok === true) {
          this.enEjecucion = false
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
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }
  
  toMayus = InputMayus.toMayus;
  
  limpiarFormulario() {
    this.formularioRol.reset();
  }

}

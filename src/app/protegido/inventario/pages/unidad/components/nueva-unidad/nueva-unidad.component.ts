import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import Swal from 'sweetalert2';
import { UnidadService } from '../../services/unidad.service';

@Component({
  selector: 'app-nueva-unidad',
  templateUrl: './nueva-unidad.component.html',
  styleUrls: ['./nueva-unidad.component.css']
})
export class NuevaUnidadComponent implements OnInit {

  constructor(private unidadService: UnidadService, private pantalla:PermisosPantallaService, private fb: FormBuilder, private authService: AuthService) { }

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

   // Propiedad para evitar doble ejecuciones al cliclear más de una vez
   enEjecucion: boolean = false;
   cambiandoContra: boolean = false;

   // Subscripciones
  subscripcion!: Subscription;

  // Formulario
  formularioCreacion: FormGroup = this.fb.group({
    nombre:             ['', [Validators.required, Validators.maxLength(15)]],
    unidad_medida:    ['', [Validators.required, Validators.maxLength(4)]],    
  })
  
  toMayus = InputMayus.toMayus;

  crearUnidad() {
    if( !this.enEjecucion ) {
      const {nombre, unidad_medida} = this.formularioCreacion.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.unidadService.postUnidad(unidad_medida, nombre, id_usuario)
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
            text: resp.msg,
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

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  ngOnDestroy(): void {
    this.cerrarCrear._elementRef.nativeElement.click()
  }

}

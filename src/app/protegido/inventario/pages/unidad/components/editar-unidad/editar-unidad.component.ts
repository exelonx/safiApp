import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import Swal from 'sweetalert2';
import { UnidadService } from '../../services/unidad.service';

@Component({
  selector: 'app-editar-unidad',
  templateUrl: './editar-unidad.component.html',
  styleUrls: ['./editar-unidad.component.css']
})
export class EditarUnidadComponent implements OnInit {
  
  constructor(private unidadService: UnidadService, private pantalla:PermisosPantallaService, private fb: FormBuilder, private authService: AuthService) { }

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('nombre') nombre!: ElementRef;
  @ViewChild('unidadMedida') unidadMedida!: ElementRef;

   // Propiedad para evitar doble ejecuciones al cliclear más de una vez
   enEjecucion: boolean = false;
   cambiandoContra: boolean = false;

   // Subscripciones
  subscripcion!: Subscription;
  
  get unidad() {
    return this.unidadService.unidad
  }

  toMayus = InputMayus.toMayusNoReactivo;

  ngOnInit(): void {
  }

  actualizarUnidad() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario;

      const nombre = this.nombre.nativeElement.value;
      const unidadMedida = this.unidadMedida.nativeElement.value;

      this.unidadService.putUnidad(this.unidad.ID, unidadMedida, nombre, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
           
            if(resp.ok === true) {
              this.cerrarEditar._elementRef.nativeElement.click();
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
              this.enEjecucion = false;
            } else {
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
              this.enEjecucion = false;
            }
          })
        )
    }  
  };

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  ngOnDestroy(): void {
    
    this.cerrarEditar._elementRef.nativeElement.click()
    
  }

}

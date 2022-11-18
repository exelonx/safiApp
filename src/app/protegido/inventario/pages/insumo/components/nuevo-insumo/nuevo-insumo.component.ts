import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import Swal from 'sweetalert2';
import { Insumo } from '../../interfaces/insumo.interface';
import { InsumoService } from '../../services/insumo.service';

@Component({
  selector: 'app-nuevo-insumo',
  templateUrl: './nuevo-insumo.component.html',
  styleUrls: ['./nuevo-insumo.component.css']
})

export class NuevoInsumoComponent implements OnInit {
  
  constructor(private insumoService: InsumoService, private pantalla:PermisosPantallaService, private fb: FormBuilder, private authService: AuthService, private ingresosService: IngresosService) { }


  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  
  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault()
    }
  }

  // Formulario
  formularioCreacion: FormGroup = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(150)]],
    unidad:    ['', [Validators.required]],
    cantidad_maxima: ['', [Validators.required]],
    cantidad_minima: ['', [Validators.required]]
    
  })

  crearInsumo() {
    if( !this.enEjecucion ) {
      const {nombre, id_unidad, cantidad_maxima, cantidad_minima} = this.formularioCreacion.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.insumoService.postInsumo(nombre, id_unidad, cantidad_maxima, cantidad_minima, id_usuario.toString())
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

  toMayus = InputMayus.toMayus;

  ngOnInit(): void {
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

}

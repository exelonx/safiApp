import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TipoImpuestoService } from '../../services/tipo-impuesto.service';
import { PermisosPantallaService } from '../../../../../services/permisos-pantalla.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { IngresosService } from '../../../../../services/ingresos.service';
import { UnidadService } from '../../../../../inventario/pages/unidad/services/unidad.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { InputMayus } from 'src/app/helpers/input-mayus';

@Component({
  selector: 'app-nuevo-impuesto',
  templateUrl: './nuevo-impuesto.component.html',
  styleUrls: ['./nuevo-impuesto.component.css']
})
export class NuevoImpuestoComponent implements OnInit {

  constructor(private impuestoService: TipoImpuestoService, private pantalla:PermisosPantallaService, private fb: FormBuilder, private authService: AuthService, 
              private ingresosService: IngresosService, private unidadService: UnidadService) { }

              
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;
              
  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
      e.preventDefault()
    }
  }

  async validarCantidad(max: number, valorRecibido: number, e: KeyboardEvent) {
    console.log(( parseInt(e.key) + valorRecibido )); 
    if (isNaN(parseInt(e.key))){
      return
    }
    if ( parseInt(( e.key) + valorRecibido.toString() ) > max) {
      e.preventDefault()
    }   
  }

  // Formulario
  formularioCreacion: FormGroup = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(150)]],
    porcentaje:    ['', [Validators.required, Validators.max(100), Validators.min(1)]]
  })

  crearImpuesto() {
    if( !this.enEjecucion ) {
      const {nombre, porcentaje} = this.formularioCreacion.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.impuestoService.crearImpuesto(nombre, porcentaje, id_usuario.toString())
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

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  toMayus = InputMayus.toMayus;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.cerrarCrear._elementRef.nativeElement.click()
  }
}

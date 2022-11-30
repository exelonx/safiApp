import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import Swal from 'sweetalert2';
import { DescuentoService } from '../../services/descuento.service';

@Component({
  selector: 'app-nuevo-descuento',
  templateUrl: './nuevo-descuento.component.html',
  styleUrls: ['./nuevo-descuento.component.css']
})
export class NuevoDescuentoComponent implements OnInit {

  constructor(private descuentoService: DescuentoService, private pantalla: PermisosPantallaService, private fb: FormBuilder, private authService: AuthService,
    private ingresosService: IngresosService) { }


  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  async validarNumeros(e: KeyboardEvent) {
    if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault()
    }
  }

  // Formulario
  formularioCreacion: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    porcentaje: ['', [Validators.required]],
    cantidad: ['', [Validators.required]]
  })

  crearDescuento() {
    if (!this.enEjecucion) {

      let id_tipo_descuento = 0;

      const { nombre, porcentaje, cantidad } = this.formularioCreacion.value;
      const id_usuario = this.authService.usuario.id_usuario;

      if (porcentaje === '1') {
        id_tipo_descuento = 1;
      } else {
        id_tipo_descuento = 2;
      }

      this.enEjecucion = true;

      this.subscripcion = this.descuentoService.postDescuento(nombre, id_tipo_descuento, cantidad, id_usuario.toString())
        .subscribe(resp => {
          this.onCrear.emit();
          if (resp.ok === true) {
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

  toMayus = InputMayus.toMayus;

  ngOnDestroy(): void {
    this.cerrarCrear._elementRef.nativeElement.click()
  }
}

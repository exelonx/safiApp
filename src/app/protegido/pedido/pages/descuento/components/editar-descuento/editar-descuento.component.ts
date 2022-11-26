import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { DescuentoService } from '../../services/descuento.service';

@Component({
  selector: 'app-editar-descuento',
  templateUrl: './editar-descuento.component.html',
  styleUrls: ['./editar-descuento.component.css']
})
export class EditarDescuentoComponent implements OnInit {


  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('nombre') nombre!: ElementRef;
  @ViewChild('cantidad') cantidad!: ElementRef;

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();

  enEjecucion: boolean = false;
  editandoProveedor: boolean = false;


  // Formulario
   formularioEdicion: FormGroup = this.fb.group({
    porcentaje: ['', [Validators.required]],
  })

  get descuento() {
    return this.descuentoService.descuento;
  }

  constructor(private descuentoService: DescuentoService, private authService: AuthService, private fb: FormBuilder) { }

  actualizarDescuento() {

    if (!this.enEjecucion) {
      this.enEjecucion = true;

      let id_tipo_descuento = 0;

      const id_usuario = this.authService.usuario.id_usuario;

      const { porcentaje } = this.formularioEdicion.value;

      const nombre = this.nombre.nativeElement.value;
      const cantidad = this.cantidad.nativeElement.value;
      // const porcentaje = this.porcentaje.nativeElement.value;
      
      if (porcentaje === '1') {
        id_tipo_descuento = 1;
      } else {
        id_tipo_descuento = 2;
      }

      this.descuentoService.putDescuento(this.descuento.ID, nombre, id_tipo_descuento, cantidad, id_usuario.toString())
        .subscribe(
          (resp => {
            this.onActualizacion.emit();

            if (resp.ok === true) {
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

  async validarNumeros(e: KeyboardEvent) {
    if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault()
    }
  }

  /*   validarFormulario(){
      this.formularioEdicion.controls['nombre'].setValue(this.insumo.NOMBRE);
      this.formularioEdicion.controls['cantidad_maxima'].setValue(this.insumo.CANTIDAD_MAXIMA);
      this.formularioEdicion.controls['cantidad_minima'].setValue(this.insumo.CANTIDAD_MINIMA);
      this.formularioEdicion.controls['nombre'].updateValueAndValidity();
    } */

  toMayus = InputMayus.toMayusNoReactivo;

  ngOnInit(): void {

  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

}

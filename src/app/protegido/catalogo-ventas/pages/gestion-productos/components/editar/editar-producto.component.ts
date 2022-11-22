import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto.interfaces';
import Swal from 'sweetalert2';
import { Insumo } from 'src/app/protegido/inventario/pages/insumo/interfaces/insumo.interface';
import { InsumoService } from 'src/app/protegido/inventario/pages/insumo/services/insumo.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  listaInsumo: Insumo[] = [];
  
  manipulado: boolean = false;
  enEjecucion: boolean = false;

  // Formularios
  formularioCreacion: FormGroup = this.fb.group({
    // Formulario
    nombre:             ['', [Validators.required, Validators.maxLength(100)]],
    // Arreglo de formularios
    compra: this.fb.array([this.fb.group({
      insumo: ['', [Validators.required]],
      cantidad: [1.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$') ]],
      precio: [0.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$') ]],
    })], [Validators.required]),
    total: [{value: '0.00', disabled: true}]
  })

  get compra() {
    return this.formularioCreacion.controls['compra'] as FormArray;
  }

  constructor( private authService: AuthService, private fb: FormBuilder, private insumoService: InsumoService,  private productoService: ProductoService ) { }

  toMayus = InputMayus.toMayusNoReactivo;
  
  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault()
    }
  }

  cerrar() {
    if(this.manipulado) {

      Swal.fire({
        title: '¡Cambios sin guardar!',
        text: "¿Desea salir del formulario sin guardar los cambios?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#898989',
        cancelButtonColor: '#d12609',
        confirmButtonText: 'Salir sin guardar',
        cancelButtonText: 'Permanecer',
        reverseButtons: true,
        background: '#2B2B2B',
        color: '#fff',
        heightAuto: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Cerrar formulario
          this.manipulado = false;
          this.cerrarCrear._elementRef.nativeElement.click()
  
          // Destruir componente
          setTimeout(() => {
            this.onCerrar.emit(false)
          }, 100);
        }
      })

    } else {
      // Cerrar formulario
      this.cerrarCrear._elementRef.nativeElement.click()
      // Destruir componente
      setTimeout(() => {
        this.onCerrar.emit(false)
      }, 100);
    }
    
  }

  ngOnInit(): void {
    /* this.cargarProveedores()
    this.cargarInsumos() */
  }

  actualizarProducto() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario;      

      /* this.productoService.putProducto()
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
        ) */
    }  
  };

}

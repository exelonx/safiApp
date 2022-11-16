import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InsumoService } from '../../../insumo/services/insumo.service';
import { Insumo, InsumoResp } from '../../../insumo/interfaces/insumo.interface';
import { ProveedorService } from '../../../proveedor/services/proveedor.service';
import { ProveedorResp, Proveedor } from '../../../proveedor/interfaces/proveedorItems.interface';
import { ComprasService } from '../../services/compras.service';
import Swal from 'sweetalert2';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-nueva-compra',
  templateUrl: './nueva-compra.component.html',
  styleUrls: ['./nueva-compra.component.css']
})
export class NuevaCompraComponent implements OnInit {

  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  listaInsumo: Insumo[] = [];
  listaProveedor: Proveedor[] = [];
  
  manipulado: boolean = false;
  enEjecucion: boolean = false;

  // Formularios
  formularioCreacion: FormGroup = this.fb.group({
    proveedor: ['', [Validators.required, Validators.maxLength(100)]],
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

  constructor( private authService: AuthService, private fb: FormBuilder, private insumoService: InsumoService, private proveedorService: ProveedorService, private compraService: ComprasService ) { }


  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault()
    }
  }

  cargarInsumos() {
    const usuario = this.authService.usuario.id_usuario;
    this.insumoService.getInsumos(usuario, "", '9999')
      .subscribe((insumo: InsumoResp) => {
        this.listaInsumo = insumo.insumos!;
      });
  }

  cargarProveedores() {
    const usuario = this.authService.usuario.id_usuario;
    this.proveedorService.getProveedores(usuario, "", "9999")
      .subscribe((proveedor: ProveedorResp) => {
        this.listaProveedor = proveedor.proveedores!;
      })
  }

  agregarInsumo() {
    this.compra.push(this.fb.group({
      insumo: ["", [Validators.required]],
      cantidad: [1.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
      precio: [0.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
    }))
  }

  ingresarCompra() {
    if( !this.enEjecucion ) {
      const usuario: number = this.authService.usuario.id_usuario;
      // Extraer datos del formulario
      const total: string = this.formularioCreacion.controls['total'].value
      const proveedor: number = this.formularioCreacion.controls['proveedor'].value
      
      this.enEjecucion = true;

      this.compraService.postCompra(usuario, proveedor, this.compra.value, total)
        .subscribe( resp => {
          if(resp.ok === true) {
            this.onCrear.emit();
            this.enEjecucion = false;
            this.manipulado = false;
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

  calcularTotal() {
    let total: number = 0.00;
    // Recorrer todo el detalle
    this.compra.controls.forEach(compra => {

      // Extraer la cantidad y precio de un registro del detalle
      let cantidad: number = compra.value.cantidad;
      let precio: number = compra.value.precio;

      // Sumar resultado al total
      total += cantidad * precio;
    });

    this.formularioCreacion.get('total')?.setValue(total.toFixed(2))
  }

  eliminarInsumo( indice: number, click: MouseEvent ) {
    let total: number = 0.00;

    // Extraer la cantidad y precio del registro por borrar
    let cantidad: number = this.compra.controls[indice].value.cantidad;
    let precio: number = this.compra.controls[indice].value.precio;

    // Extraer total
    total = this.formularioCreacion.controls['total'].value

    // Calcular nuevo total
    let nuevoTotal: number = total - (cantidad * precio)

    // Establecer nuevo total
    this.formularioCreacion.get('total')?.setValue(nuevoTotal.toFixed(2))

    // Borrar elemento
    this.compra.removeAt(indice)
    click.stopPropagation()
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
    this.cargarProveedores()
    this.cargarInsumos()
  }

}

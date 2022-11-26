import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Insumo, InsumoResp } from '../../../insumo/interfaces/insumo.interface';
import { InsumoService } from '../../../insumo/services/insumo.service';
import { Proveedor, ProveedorResp } from '../../../proveedor/interfaces/proveedorItems.interface';
import { ProveedorService } from '../../../proveedor/services/proveedor.service';
import { ComprasService } from '../../services/compras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-compra',
  templateUrl: './editar-compra.component.html',
  styleUrls: ['./editar-compra.component.css']
})
export class EditarCompraComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('totalPagado') totalPagado!: ElementRef;
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onEditar: EventEmitter<void> = new EventEmitter();

  listaInsumo: Insumo[] = [];
  listaProveedor: Proveedor[] = [];
  
  enEjecucion: boolean = false;
  editandoProveedor: boolean = false;

  // Formularios
  formularioNuevo: FormGroup = this.fb.group({
    // Arreglo de formularios
    compra: this.fb.array([]),
    total: [{value: '0.00', disabled: true}]
  })

  formularioEditar: FormGroup = this.fb.group({
    // Arreglo de formularios
    insumo: ["", [Validators.required]],
    cantidad: [1.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
    precio: [0.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
  })

  formularioEditarProveedor: FormGroup = this.fb.group({
    // Arreglo de formularios
    proveedor: [[Validators.required]]
  })

  get compra() {
    return this.formularioNuevo.controls['compra'] as FormArray;
  }

  get detalleExistente() {
    return this.formularioEditar.controls['compraExistentes'] as FormArray;
  }

  get compraHecha() {
    return this.compraService.compra;
  }

  get detalle() {
    return this.compraService.detalleCompra;
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

    this.formularioNuevo.get('total')?.setValue(total.toFixed(2))
  }

  eliminarInsumo( indice: number, click: MouseEvent ) {
    let total: number = 0.00;

    // Extraer la cantidad y precio del registro por borrar
    let cantidad: number = this.compra.controls[indice].value.cantidad;
    let precio: number = this.compra.controls[indice].value.precio;

    // Extraer total
    total = this.formularioNuevo.controls['total'].value

    // Calcular nuevo total
    let nuevoTotal: number = total - (cantidad * precio)

    // Establecer nuevo total
    this.formularioNuevo.get('total')?.setValue(nuevoTotal.toFixed(2))

    // Borrar elemento
    this.compra.removeAt(indice)
    click.stopPropagation()
  }

  cerrar() {
    if(this.compra.controls.length > 0) {

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
          this.cerrarEditar._elementRef.nativeElement.click()
  
          // Destruir componente
          setTimeout(() => {
            this.onCerrar.emit(false)
          }, 100);
        }
      })

    } else {
      // Cerrar formulario
      this.cerrarEditar._elementRef.nativeElement.click()
      // Destruir componente
      setTimeout(() => {
        this.onCerrar.emit(false)
      }, 100);
    }
    
  }

  editar(idDetalle: number, indice: number){
    let { insumo, precio, cantidad } = this.formularioEditar.value

    this.compraService.putDetalle(idDetalle, insumo, parseFloat(cantidad), parseFloat(precio))
      .subscribe( resp => {
        if(resp.ok === true && resp.detalle && resp.compra ) {
          // Actualizar datos en pantalla
          this.detalle[indice].CANTIDAD = resp.detalle.CANTIDAD;
          this.detalle[indice].ID_INSUMO = resp.detalle.ID_INSUMO;
          this.detalle[indice].PRECIO_COMPRA = resp.detalle.PRECIO_COMPRA;
          this.compraHecha.TOTAL_PAGADO = resp.compra.TOTAL_PAGADO;
          this.totalPagado.nativeElement.value = (Number(this.compraHecha.TOTAL_PAGADO).toFixed(2) + 'Lps')

          this.onEditar.emit();
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
          this.detalle[indice].editar = false
        } else if(resp.ok === true) {
          Swal.fire({
            title: 'Sin cambios',
            text: 'No se realizó ningún cambio',
            icon: 'info',
            iconColor: 'white',
            background: '#3fc3ee',
            color: 'white',
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          })
          this.detalle[indice].editar = false
        } else {
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
          this.detalle[indice].editar = false
        }
      })
  }

  abrirEdicionProveedor(click: MouseEvent) {
    this.editandoProveedor = true;
    click.stopPropagation()
  }

  agregarMasInsumos() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;
      const total: string = this.formularioNuevo.controls['total'].value

      this.compraService.putMasInsumosEnDetalle(this.compra.value, total, this.compraHecha.ID)
       .subscribe(
         resp => {
          if(resp.ok === true && resp.nuevo_detalle){ // Si todo salio bien
            
            this.compraHecha.TOTAL_PAGADO = resp.nuevoTotal!;
            this.totalPagado.nativeElement.value = (Number(this.compraHecha.TOTAL_PAGADO).toFixed(2) + 'Lps')

            // Insertar nuevo detalle a la factura
            resp.nuevo_detalle.forEach(insumo => {
              this.detalle.push(insumo)
              
            });

            // Establecer nuevo total
            this.formularioNuevo.get('total')?.setValue(0.00)

            // Borrar elemento
            this.compra.clear()
            this.onEditar.emit();
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
            this.enEjecucion = false;
          }

         }
       )
    }
  }

  eliminar(id_detalle: number, index: number) {
    this.compraService.deleteItemDetalle(id_detalle)
      .subscribe( resp => {
        if(resp.ok === true) {
          this.compraHecha.TOTAL_PAGADO = resp.nuevoTotal!;
          this.totalPagado.nativeElement.value = (Number(this.compraHecha.TOTAL_PAGADO).toFixed(2) + 'Lps')

          // Eliminar detalle del formulario
          this.detalle.splice(index, 1)
          this.onEditar.emit();

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

  ngOnInit(): void {
    this.cargarInsumos()
    this.cargarProveedores()
  }

  cargarFormulariosEdicion(index: number) {

    this.detalle.forEach((item, i) => {
      if( i !== index ) {
        item.editar = false;
      } else {
        this.formularioEditar.reset()
        this.formularioEditar.controls['insumo'].setValue(item.ID_INSUMO)
        this.formularioEditar.controls['cantidad'].setValue(item.CANTIDAD)
        this.formularioEditar.controls['precio'].setValue(item.PRECIO_COMPRA)
      }
    })
  }

  cargarFormulariosEdicionProveedor() {

    this.formularioEditarProveedor.reset()
    this.formularioEditarProveedor.controls['proveedor'].setValue(this.compraHecha.ID_PROVEEDOR)
    this.formularioEditarProveedor.updateValueAndValidity();
    
  }

  editarProveedor() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      const idProveedor = this.formularioEditarProveedor.controls['proveedor'].value;
      const usuario = this.authService.usuario.id_usuario

      this.compraService.putNombreProveedor(idProveedor, this.compraHecha.ID, usuario)
      .subscribe( resp => {
        this.onEditar.emit();
        if(resp.ok === true) {
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
          this.enEjecucion = false;
        }
      })
      
    }

  }

}

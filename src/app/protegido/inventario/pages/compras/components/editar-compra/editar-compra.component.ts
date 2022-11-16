import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  listaInsumo: Insumo[] = [];
  listaProveedor: Proveedor[] = [];
  
  enEjecucion: boolean = false;
  editandoProveedor: boolean = false;

  // Formularios
  formularioEdicion: FormGroup = this.fb.group({
    // Arreglo de formularios
    compra: this.fb.array([]),
    total: [{value: '0.00', disabled: true}]
  })

  get compra() {
    return this.formularioEdicion.controls['compra'] as FormArray;
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

    this.formularioEdicion.get('total')?.setValue(total.toFixed(2))
  }

  eliminarInsumo( indice: number, click: MouseEvent ) {
    let total: number = 0.00;

    // Extraer la cantidad y precio del registro por borrar
    let cantidad: number = this.compra.controls[indice].value.cantidad;
    let precio: number = this.compra.controls[indice].value.precio;

    // Extraer total
    total = this.formularioEdicion.controls['total'].value

    // Calcular nuevo total
    let nuevoTotal: number = total - (cantidad * precio)

    // Establecer nuevo total
    this.formularioEdicion.get('total')?.setValue(nuevoTotal.toFixed(2))

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

  abrirEdicionProveedor(click: MouseEvent) {
    this.editandoProveedor = true;
    click.stopPropagation()
  }

  ngOnInit(): void {
    this.cargarInsumos()
    this.cargarProveedores()
  }

}

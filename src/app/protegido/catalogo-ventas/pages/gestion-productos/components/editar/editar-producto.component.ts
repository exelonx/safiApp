import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoResp } from '../../interfaces/producto.interfaces';
import Swal from 'sweetalert2';
import { Insumo, InsumoResp } from 'src/app/protegido/inventario/pages/insumo/interfaces/insumo.interface';
import { InsumoService } from 'src/app/protegido/inventario/pages/insumo/services/insumo.service';
import { ProveedorService } from 'src/app/protegido/inventario/pages/proveedor/services/proveedor.service';
import { ComprasService } from 'src/app/protegido/inventario/pages/compras/services/compras.service';
import { Proveedor, ProveedorResp } from 'src/app/protegido/inventario/pages/proveedor/interfaces/proveedorItems.interface';
import { TipoImpuestoService } from '../../../tipo-impuesto/services/tipo-impuesto.service';
import { Impuesto, ImpuestoResp } from '../../../tipo-impuesto/interfaces/impuesto.interface';
import { Categoria, CategoriaResp } from '../../../gestion-categoria/interfaces/categoriaItems.interface';
import { CategoriaService } from '../../../gestion-categoria/services/categoria.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('totalPagado') totalPagado!: ElementRef;
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onEditar: EventEmitter<void> = new EventEmitter();

  listaInsumo: Insumo[] = [];
  listaImpuesto: Impuesto[] = [];
  listaCategoria: Categoria[] = [];
  listaProductos: Producto[] = [];
  
  enEjecucion: boolean = false;
  editandoProducto: boolean = false;

  // =========================Formularios PRODUCTOS=======================
  // Editar info
  formularioInfoProducto: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    precio: [0.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
    impuesto: ['', [Validators.required, Validators.maxLength(10)]],
    descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    bebida: [false, [Validators.required]],
    exento: [false, [Validators.required]],
    sinEstado: [false, [Validators.required]],
  })
  // Editar Insumo
  formularioEditarInsumo: FormGroup = this.fb.group({
    // Arreglo de formularios
    insumo: ["", [Validators.required]],
    cantidad: [1.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
  })
  
  // Agregar insumo
  formularioNuevoInsumo: FormGroup = this.fb.group({
    // Arreglo de formularios
    insumo: this.fb.array([])
  })

  // Formularios COMBOS
  formularioInfoCombo: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    precio: [0.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
    descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    impuesto: ['', [Validators.required, Validators.maxLength(10)]],
    sinEstado: [false, [Validators.required]]
  })
  // Editar producto-combo
  formularioEditarProducto: FormGroup = this.fb.group({
    // Arreglo de formularios
    producto: ["", [Validators.required]],
    cantidad: [1.00, [Validators.required, Validators.min(0.01)]]
  })
  
  // Agregar producto
  formularioNuevoProducto: FormGroup = this.fb.group({
    // Arreglo de formularios
    producto: this.fb.array([])
  })

  // Formularios Promociones
  formularioInfoPromocion: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    precio: [0.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
    descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    impuesto: ['', [Validators.required, Validators.maxLength(10)]],
    sinEstado: [false, [Validators.required]],
    fecha_inicial: ['', [Validators.required]],
    fecha_final: ['', [Validators.required]],
  })

  // ============================================================

  // agregar catalogo
  formularioNuevoCatalogo: FormGroup = this.fb.group({
    // Arreglo de formularios
    catalogo: this.fb.array([])
  })

  // Editar catalogo
  FormGroup = this.fb.group({
    // Arreglo de formularios
    catalogo: ["", [Validators.required]],
  })

  // ============================================================
  
  // TODO: GETTERS FORMULARIOS
  get insumoArr() {
    return this.formularioNuevoInsumo.controls['insumo'] as FormArray;
  }

  get productoArr() {
    return this.formularioNuevoProducto.controls['producto'] as FormArray;
  }

  get catalogoArr() {
    return this.formularioNuevoCatalogo.controls['catalogo'] as FormArray;
  }

  // TODO: ESTO SE QUEDA

  get producto() {
    return this.productoService.producto;
  }

  // LISTAS
  get insumos() {
    return this.productoService.insumoProducto;
  }

  get categorias() {
    return this.productoService.catalogoProducto;
  }

  get promos() {
    return this.productoService.promoProducto;
  }

  get combos() {
    return this.productoService.comboProducto;
  }

  constructor( private categoriaService: CategoriaService, private impuestoService: TipoImpuestoService, private productoService: ProductoService, private authService: AuthService, private fb: FormBuilder, private insumoService: InsumoService, private proveedorService: ProveedorService, private compraService: ComprasService ) { }

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
  cargarImpuestos() {
    const usuario = this.authService.usuario.id_usuario;
    this.impuestoService.getImpuestos(usuario, "", '9999')
      .subscribe((impuesto: ImpuestoResp) => {
        this.listaImpuesto = impuesto.impuestos!;
      });
  }
  cargarCategoria() {
    const usuario = this.authService.usuario.id_usuario;
    this.categoriaService.getCategorias(usuario, "", '9999')
      .subscribe((categoria: CategoriaResp) => {
        this.listaCategoria = categoria.catalogos!;
      });
  }
  cargarProducto() {
    const usuario = this.authService.usuario.id_usuario;
    this.productoService.getProductos(1, usuario, "", '9999')
      .subscribe((producto: ProductoResp) => {
        this.listaProductos = producto.productos!;
      });
  }

  agregarInsumo() {
    this.insumoArr.push(this.fb.group({
      insumo: ["", [Validators.required]],
      cantidad: [1.00, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
    }))
  }

  eliminarInsumo( indice: number, click: MouseEvent ) {
    // Borrar elemento
    // this.compra.removeAt(indice)
    click.stopPropagation()
  }

  cerrar() {
    if(this.insumoArr.controls.length > 0 || this.productoArr.controls.length > 0) {

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
    // let { insumo, precio, cantidad } = this.formularioEditar.value

    // this.compraService.putDetalle(idDetalle, insumo, parseFloat(cantidad), parseFloat(precio))
    //   .subscribe( resp => {
    //     if(resp.ok === true && resp.detalle && resp.compra ) {
          // Actualizar datos en pantalla
          // this.detalle[indice].CANTIDAD = resp.detalle.CANTIDAD;
          // this.detalle[indice].ID_INSUMO = resp.detalle.ID_INSUMO;
          // this.detalle[indice].PRECIO_COMPRA = resp.detalle.PRECIO_COMPRA;

      //     this.onEditar.emit();
      //     Swal.fire({
      //       title: '¡Éxito!',
      //       text: resp.msg,
      //       icon: 'success',
      //       iconColor: 'white',
      //       background: '#a5dc86',
      //       color: 'white',
      //       toast: true,
      //       position: 'top-right',
      //       showConfirmButton: false,
      //       timer: 4500,
      //       timerProgressBar: true,
      //     })
      //     this.detalle[indice].editar = false
      //   } else if(resp.ok === true) {
      //     Swal.fire({
      //       title: 'Sin cambios',
      //       text: 'No se realizó ningún cambio',
      //       icon: 'info',
      //       iconColor: 'white',
      //       background: '#3fc3ee',
      //       color: 'white',
      //       toast: true,
      //       position: 'top-right',
      //       showConfirmButton: false,
      //       timer: 2000,
      //       timerProgressBar: true,
      //     })
      //     this.detalle[indice].editar = false
      //   } else {
      //     Swal.fire({
      //       title: 'Advertencia',
      //       text: resp.msg,
      //       icon: 'warning',
      //       iconColor: 'white',
      //       background: '#f8bb86',
      //       color: 'white',
      //       toast: true,
      //       position: 'top-right',
      //       showConfirmButton: false,
      //       timer: 4500,
      //       timerProgressBar: true,
      //     })
      //     this.detalle[indice].editar = false
      //   }
      // })
  }

  abrirEdicionProducto(click: MouseEvent) {
    this.editandoProducto = true;
    click.stopPropagation()
  }

  agregarMasInsumos() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;
      // const total: string = this.formularioNuevo.controls['total'].value

      // this.compraService.putMasInsumosEnDetalle(this.compra.value, total, this.compraHecha.ID)
      //  .subscribe(
      //    resp => {
      //     if(resp.ok === true && resp.nuevo_detalle){ // Si todo salio bien
            
      //       this.compraHecha.TOTAL_PAGADO = resp.nuevoTotal!;
      //       this.totalPagado.nativeElement.value = (Number(this.compraHecha.TOTAL_PAGADO).toFixed(2) + 'Lps')

      //       // Insertar nuevo detalle a la factura
      //       resp.nuevo_detalle.forEach(insumo => {
      //         this.detalle.push(insumo)
              
      //       });

      //       // Establecer nuevo total
      //       this.formularioNuevo.get('total')?.setValue(0.00)

      //       // Borrar elemento
      //       this.compra.clear()
      //       this.onEditar.emit();
      //       Swal.fire({
      //         title: '¡Éxito!',
      //         text: resp.msg,
      //         icon: 'success',
      //         iconColor: 'white',
      //         background: '#a5dc86',
      //         color: 'white',
      //         toast: true,
      //         position: 'top-right',
      //         showConfirmButton: false,
      //         timer: 4500,
      //         timerProgressBar: true,
      //       })

      //       this.enEjecucion = false;
      //     } else {

      //       Swal.fire({
      //         title: 'Advertencia',
      //         text: resp.msg,
      //         icon: 'warning',
      //         iconColor: 'white',
      //         background: '#f8bb86',
      //         color: 'white',
      //         toast: true,
      //         position: 'top-right',
      //         showConfirmButton: false,
      //         timer: 4500,
      //         timerProgressBar: true,
      //       })
      //       this.enEjecucion = false;
      //     }

      //    }
      //  )
    }
  }

  eliminar(id_detalle: number, index: number) {
    this.compraService.deleteItemDetalle(id_detalle)
      .subscribe( resp => {
        if(resp.ok === true) {
          
          // Eliminar detalle del formulario
          // this.detalle.splice(index, 1)
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

  ngOnDestroy(): void {
    
    this.cerrarEditar._elementRef.nativeElement.click()
    
  }

  ngOnInit(): void {
  
    this.cargarInsumos(),
    this.cargarCategoria(),
    this.cargarImpuestos(),
    this.cargarProducto()

  }

  cargarFormulariosEdicionInsumo(index: number) {

    this.insumos.forEach((item, i) => {
      if( i !== index ) {
        item.editar = false;
      } else {
        this.formularioEditarInsumo.reset()
        this.formularioEditarInsumo.controls['insumo'].setValue(item.ID_INSUMO)
        this.formularioEditarInsumo.controls['cantidad'].setValue(item.CANTIDAD)
      }
    })
  }

}

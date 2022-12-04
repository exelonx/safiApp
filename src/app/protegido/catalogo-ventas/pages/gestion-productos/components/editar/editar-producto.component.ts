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

  toMayus = InputMayus.toMayus;

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
  editandoCategoria: boolean = false;

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
    cantidad: [1.00, [Validators.required, Validators.min(1)]]
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
  formularioEditarCategoria: FormGroup = this.fb.group({
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

  async validarNumerosComboPromo(e: KeyboardEvent) {
    if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
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

  agregarProducto() {
    this.productoArr.push(this.fb.group({
      producto: ["", [Validators.required]],
      cantidad: [1.00, [Validators.required, Validators.min(1)]]
    }))
  }

  agregarCategoriaProducto() {
    this.catalogoArr.push(this.fb.control(
      '', [Validators.required]))
  }

  eliminarInsumo( indice: number, click: MouseEvent ) {
    // Borrar elemento
    this.insumoArr.removeAt(indice)
    click.stopPropagation()
  }

  eliminarProducto( indice: number, click: MouseEvent) {
    // Borrar elemento
    this.productoArr.removeAt(indice)
    click.stopPropagation()
  }

  eliminarCategoriaProducto(indice: number, click: MouseEvent) {
    // Borrar elemento
    this.catalogoArr.removeAt(indice)
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

  editarInsumo(idInsumoProducto: number, indice: number){
    let { insumo, cantidad } = this.formularioEditarInsumo.value;
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.putInsumoProducto(id_usuario, idInsumoProducto, insumo, cantidad)
      .subscribe( resp => {
        if(resp.ok === true ) {
          //Actualizar datos en pantalla
          this.insumos[indice].CANTIDAD = cantidad;
          this.insumos[indice].ID_INSUMO = insumo;
          this.insumos[indice].NOMBRE_INSUMO = resp.nombreInsumo!;

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
          this.insumos[indice].editar = false
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
          this.insumos[indice].editar = false
        }
      })
  }

  editarProductoCombo(idComboProducto: number, indice: number) {
    let { producto, cantidad } = this.formularioEditarProducto.value;
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.putComboProducto(id_usuario, idComboProducto, producto, cantidad)
      .subscribe( resp => {
        if(resp.ok === true ) {
          //Actualizar datos en pantalla
          this.combos[indice].CANTIDAD = cantidad;
          this.combos[indice].ID_PRODUCTO = producto;
          this.combos[indice].NOMBRE_PRODUCTO = resp.nombreCombo!;

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
          this.combos[indice].editar = false
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
          this.combos[indice].editar = false
        }
      })
  }

  editarProductoPromo(idPromoProducto: number, indice: number) {
    let { producto, cantidad } = this.formularioEditarProducto.value;
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.putPromoProducto(id_usuario, idPromoProducto, producto, cantidad)
      .subscribe( resp => {
        if(resp.ok === true ) {
          //Actualizar datos en pantalla
          this.promos[indice].CANTIDAD = cantidad;
          this.promos[indice].ID_PRODUCTO = producto;
          this.promos[indice].NOMBRE_PRODUCTO = resp.nombrePromo!;

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
          this.promos[indice].editar = false
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
          this.promos[indice].editar = false
        }
      })
  }

  editarCategoria(idCategoriaProducto: number, indice: number){
    let { catalogo } = this.formularioEditarCategoria.value;
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.putCategoriaProducto(id_usuario, idCategoriaProducto, catalogo)
      .subscribe( resp => {
        if(resp.ok === true ) {
          //Actualizar datos en pantalla
          this.categorias[indice].ID_CATALOGO = catalogo;
          this.categorias[indice].NOMBRE_CATALOGO = resp.nombreCategoria!;

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
          this.categorias[indice].editar = false
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
          this.categorias[indice].editar = false
        }
      })
  }

  // =============== FORMULARIO PRODUCTO =====================

  abrirEdicionProducto(click: MouseEvent) {
    this.editandoProducto = true;
    click.stopPropagation()
  }

  cargarFormulariosEdicionProducto() {

    this.formularioInfoProducto.reset()
    this.formularioInfoProducto.controls['nombre'].setValue(this.producto.NOMBRE)
    this.formularioInfoProducto.controls['precio'].setValue(this.producto.PRECIO)
    this.formularioInfoProducto.controls['impuesto'].setValue(this.producto.ID_IMPUESTO)
    this.formularioInfoProducto.controls['descripcion'].setValue(this.producto.DESCRIPCION)
    this.formularioInfoProducto.controls['bebida'].setValue(this.producto.BEBIDA)
    this.formularioInfoProducto.controls['exento'].setValue(this.producto.EXENTA)
    this.formularioInfoProducto.controls['sinEstado'].setValue(this.producto.SIN_ESTADO)
    
    this.formularioInfoProducto.updateValueAndValidity();
    
  }

  cargarFormulariosEdicionPromo() {

    this.formularioInfoPromocion.reset()
    this.formularioInfoPromocion.controls['nombre'].setValue(this.producto.NOMBRE)
    this.formularioInfoPromocion.controls['precio'].setValue(this.producto.PRECIO)
    this.formularioInfoPromocion.controls['impuesto'].setValue(this.producto.ID_IMPUESTO)
    this.formularioInfoPromocion.controls['descripcion'].setValue(this.producto.DESCRIPCION)

    this.formularioInfoPromocion.controls['sinEstado'].setValue(this.producto.SIN_ESTADO)

    this.formularioInfoPromocion.controls['fecha_inicial'].setValue(this.producto.FECHA_INICIO)
    this.formularioInfoPromocion.controls['fecha_final'].setValue(this.producto.FECHA_FINAL)
    
    this.formularioInfoPromocion.updateValueAndValidity();
    
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

  cargarFormulariosEdicionProductoCombo(index: number) {

    this.combos.forEach((item, i) => {
      if( i !== index ) {
        item.editar = false;
      } else {
        this.formularioEditarProducto.reset()
        this.formularioEditarProducto.controls['producto'].setValue(item.ID_PRODUCTO)
        this.formularioEditarProducto.controls['cantidad'].setValue(item.CANTIDAD)
      }
    })
  }

  cargarFormulariosEdicionProductoPromo(index: number) {

    this.promos.forEach((item, i) => {
      if( i !== index ) {
        item.editar = false;
      } else {
        this.formularioEditarProducto.reset()
        this.formularioEditarProducto.controls['producto'].setValue(item.ID_PRODUCTO)
        this.formularioEditarProducto.controls['cantidad'].setValue(item.CANTIDAD)
      }
    })
  }
  
  putProducto() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;
      const { nombre, precio, impuesto, descripcion, bebida, exento, sinEstado } = this.formularioInfoProducto.value;
      const id_usuario = this.authService.usuario.id_usuario;

      console.log(precio)
  
      this.productoService.putInfoProducto(id_usuario, this.producto.ID, nombre, precio, impuesto, descripcion, sinEstado, bebida, exento)
        .subscribe(
          resp => {
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
              this.cerrarEditar._elementRef.nativeElement.click()
      
              // Destruir componente
              setTimeout(() => {
                this.onEditar.emit();
                this.onCerrar.emit(false)
              }, 100);
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
        );

    }
  }

  putPromocion() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;
      const { nombre, precio, impuesto, descripcion, sinEstado, fecha_inicial, fecha_final } = this.formularioInfoPromocion.value;
      const id_usuario = this.authService.usuario.id_usuario;

      console.log(precio)
  
      this.productoService.putInfoProducto(id_usuario, this.producto.ID, nombre, precio, impuesto, descripcion, sinEstado, false, false, fecha_inicial, fecha_final)
        .subscribe(
          resp => {
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
              this.cerrarEditar._elementRef.nativeElement.click()
      
              // Destruir componente
              setTimeout(() => {
                this.onEditar.emit();
                this.onCerrar.emit(false)
              }, 100);
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
        );

    }
  }

  agregarMasInsumos() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario

      this.productoService.putMasInsumoProducto(id_usuario, this.producto.ID, this.insumoArr.value)
       .subscribe(
         resp => {
          if(resp.ok === true && resp.nuevoInsumoProducto){ // Si todo salio bien

            // Insertar nuevo detalle a la factura
            this.productoService.insumoProducto = resp.nuevoInsumoProducto!;

            // Borrar elemento
            this.insumoArr.clear()
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

  agregarMasProductoCombo() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario

      this.productoService.putMasComboProducto(id_usuario, this.producto.ID, this.productoArr.value)
       .subscribe(
         resp => {
          if(resp.ok === true && resp.nuevoComboProducto){ // Si todo salio bien

            // Insertar nuevo detalle a la factura
            this.productoService.comboProducto = resp.nuevoComboProducto!;

            // Borrar elemento
            this.productoArr.clear()
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

  agregarMasProductoPromo() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario

      this.productoService.putMasPromoProducto(id_usuario, this.producto.ID, this.productoArr.value)
       .subscribe(
         resp => {
          if(resp.ok === true && resp.nuevoPromoProducto){ // Si todo salio bien

            // Insertar nuevo detalle a la factura
            this.productoService.promoProducto = resp.nuevoPromoProducto!;

            // Borrar elemento
            this.productoArr.clear()
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

  agregarMasCatalogo() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario

      this.productoService.putMasCategoriaProducto(id_usuario, this.producto.ID, this.catalogoArr.value)
       .subscribe(
         resp => {
          if(resp.ok === true && resp.nuevoCatalogoProducto){ // Si todo salio bien

            // Insertar nuevo detalle a la factura
            this.productoService.catalogoProducto = resp.nuevoCatalogoProducto!;

            // Borrar elemento
            this.catalogoArr.clear()
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

  eliminarInsumoProducto(id_detalle: number, index: number) {
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.deleteInsumoProducto(id_usuario, id_detalle)
      .subscribe( resp => {
        if(resp.ok === true) {
          
          // Eliminar detalle del formulario
          this.insumos.splice(index, 1)
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

  eliminarProductoCombo(id_detalle: number, index: number) {
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.deleteComboProducto(id_usuario, id_detalle)
      .subscribe( resp => {
        if(resp.ok === true) {
          
          // Eliminar detalle del formulario
          this.combos.splice(index, 1)
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

  eliminarProductoPromo(id_detalle: number, index: number) {
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.deletePromoProducto(id_usuario, id_detalle)
      .subscribe( resp => {
        if(resp.ok === true) {
          
          // Eliminar detalle del formulario
          this.promos.splice(index, 1)
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

  eliminarCategoriaProductoDB(id_detalle: number, index: number) {
    const id_usuario = this.authService.usuario.id_usuario;
    this.productoService.deleteCategoriaProducto(id_usuario, id_detalle)
      .subscribe( resp => {
        if(resp.ok === true) {
          
          // Eliminar detalle del formulario
          this.categorias.splice(index, 1)
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


  cargarFormulariosEdicionCategoria(index: number) {

    this.categorias.forEach((item, i) => {
      if( i !== index ) {
        item.editar = false;
      } else {
        this.formularioEditarCategoria.reset()
        this.formularioEditarCategoria.controls['catalogo'].setValue(item.ID_CATALOGO)
      }
    })
  }

}

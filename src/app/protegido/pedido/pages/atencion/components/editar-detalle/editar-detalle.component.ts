import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Categoria } from 'src/app/protegido/catalogo-ventas/pages/gestion-categoria/interfaces/categoriaItems.interface';
import { Producto, TipoProducto } from 'src/app/protegido/catalogo-ventas/pages/gestion-productos/interfaces/producto.interfaces';
import { ProductoAgregado } from '../../interfaces/pedido.interfaces';
import { PedidoService } from '../../services/pedido.service';
import { ProductoService } from '../../../../../catalogo-ventas/pages/gestion-productos/services/producto.service';
import { CategoriaService } from '../../../../../catalogo-ventas/pages/gestion-categoria/services/categoria.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-detalle',
  templateUrl: './editar-detalle.component.html',
  styleUrls: ['./editar-detalle.component.css']
})
export class EditarDetalleComponent implements OnInit, AfterViewInit {

  constructor( private activatedRouter: ActivatedRoute, private pedidoService: PedidoService, private productoService: ProductoService, private categoriaService: CategoriaService, private authService: AuthService, private fb: FormBuilder, private router: Router ) { }

  get pedido() {
    return this.pedidoService.pedidoSeleccionado
  }

  get pedidoSeleccionado() {
    return this.pedidoService.pedidoSeleccionado;
  }

  get detalleSeleccionado() {
    return this.pedidoService.detalleSeleccionado;
  }

  precioAux: number = this.detalleSeleccionado.PRECIO_PRODUCTO
  cantidadAux: number = this.detalleSeleccionado.CANTIDAD

  detalleNuevo = {
    ID: 0,
    ID_PEDIDO: 0,
    ID_PRODUCTO: 0,
    NOMBRE_PRODUCTO: "",
    PRECIO_PRODUCTO: 0.00,
    DESCRIPCION: "",
    ID_ESTADO: 0,
    ESTADO: "",
    COLOR: "",
    CANTIDAD: 0,
    PARA_LLEVAR: false,
    HORA: new Date,
    INFORMACION: "",
    TOTAL_IMPUESTO: "",
    PRECIO_DETALLE: "",
    PORCENTAJE_IMPUESTO: 0,
    ID_IMPUESTO: 0
  }

  // Componentes
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('categoria') categoria!: ElementRef;
  @ViewChild('tipoProducto') tipoProducto!: ElementRef;
  @ViewChild('bebida') bebida!: MatCheckbox;
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;
  @ViewChild('cantidad') cantidad!: ElementRef;
  @ViewChild('precio') precio!: ElementRef;
  @ViewChild('nombreProducto') nombreProducto!: ElementRef;

  // Atributos de pantalla
  pantalla: string = 'Menú';
  generando: boolean = false;
  editando: boolean = false;
  checked: boolean = false;
  enEjecucion: boolean = false;

  // Listas
  listaCategoria: Categoria[] = [];
  listaBebidas: Producto[] = [];
  listaTipo: TipoProducto[] = [];
  listaProducto: Producto[] = [];
  listaBebida: Producto[] = [];
  productosAgregados: ProductoAgregado[] = [];

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  formularioEliminacion: FormGroup = this.fb.group({
    motivo: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(10)]]
  })

  ngOnInit(): void {
    this.cargarCategoria();
    this.cargarTipoProducto();
    this.cargarDetalle()
  }

  async validarNumeros(e: KeyboardEvent) {
    e.preventDefault()
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
      e.preventDefault()
    }
  }

  ngAfterViewInit(): void {
    
    this.cargarProductos();
    
  }

  cargarCategoria() {
    const usuario = this.authService.usuario.id_usuario
    this.categoriaService.getCategorias(usuario, "", "99999")
      .subscribe(
        resp => {
          this.listaCategoria = resp.catalogos!;
        }
      )
  }

  cargarDetalle() {
    let id_detalle: string = ""
    this.activatedRouter.params.subscribe(parametro => {
      id_detalle = parametro['id_detalle']
    
      this.pedidoService.getUnDetallePedido( id_detalle )
        .subscribe( 
          resp => {
            this.detalleNuevo.CANTIDAD = this.detalleSeleccionado.CANTIDAD
            this.detalleNuevo.ID_PRODUCTO = this.detalleSeleccionado.ID_PRODUCTO
            this.detalleNuevo.PRECIO_PRODUCTO = this.detalleSeleccionado.PRECIO_PRODUCTO
          }
        )

    })
  }

  
  cargarTipoProducto(){
    this.productoService.getTipoProducto()
      .subscribe(
        resp => {
          this.listaTipo = resp.tipoProducto!
        }
      )
  }

  cargarProductos() {
    const categoria: string = this.categoria.nativeElement.value;
    const tipoProducto: string = this.tipoProducto.nativeElement.value;
    const { buscar } = this.formularioBusqueda.value;

    this.pedidoService.getProductos(buscar, tipoProducto, categoria)
      .subscribe(
        resp => {
          this.listaProducto = resp.productos!;
        }
      )
  }

  seleccionarProducto(producto: Producto) {

    let precio: any = producto.PRECIO
    this.detalleNuevo.ID_PRODUCTO = producto.ID;
    this.precio.nativeElement.value = this.cantidad.nativeElement.value * parseFloat(precio)
    this.nombreProducto.nativeElement.value = producto.NOMBRE
    this.detalleNuevo.PRECIO_PRODUCTO = parseFloat(precio)
    this.detalleNuevo.CANTIDAD = this.cantidad.nativeElement.value

    this.cantidadAux = this.cantidad.nativeElement.value
  }

  cambiarCantidad() {

    this.precio.nativeElement.value = this.detalleNuevo.PRECIO_PRODUCTO * this.cantidad.nativeElement.value 
    this.cantidadAux = this.cantidad.nativeElement.value
    this.detalleNuevo.CANTIDAD = this.cantidad.nativeElement.value

  }

  actualizarDetalle() {

    const { motivo } = this.formularioEliminacion.value

    if (!this.enEjecucion) {
      this.pedidoService.putDetalle(this.detalleSeleccionado.ID, this.detalleNuevo.ID_PRODUCTO, this.cantidadAux, this.authService.usuario.id_usuario, motivo)
        .subscribe(

          resp => {
            this.router.navigateByUrl('/main/pedido/atencion')
            if (resp.ok === true) {

              this.enEjecucion = false;
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
          }


        )
    }
  }

}

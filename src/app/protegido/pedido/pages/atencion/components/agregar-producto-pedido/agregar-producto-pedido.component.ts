import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../../../../catalogo-ventas/pages/gestion-categoria/services/categoria.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { Categoria } from '../../../../../catalogo-ventas/pages/gestion-categoria/interfaces/categoriaItems.interface';
import { Producto, TipoProducto } from '../../../../../catalogo-ventas/pages/gestion-productos/interfaces/producto.interfaces';
import { ProductoService } from '../../../../../catalogo-ventas/pages/gestion-productos/services/producto.service';
import { PedidoService } from '../../services/pedido.service';
import { ProductoAgregado } from '../../interfaces/pedido.interfaces';

@Component({
  selector: 'app-agregar-producto-pedido',
  templateUrl: './agregar-producto-pedido.component.html',
  styleUrls: ['./agregar-producto-pedido.component.css']
})
export class AgregarProductoPedidoComponent implements OnInit, AfterViewInit {

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('categoria') categoria!: ElementRef;
  @ViewChild('tipoProducto') tipoProducto!: ElementRef;

  pantalla: string = 'Menú';
  generando: boolean = false;

  // Listas
  listaCategoria: Categoria[] = [];
  listaBebidas: Producto[] = [];
  listaTipo: TipoProducto[] = [];
  listaProducto: Producto[] = [];
  listaBebida: Producto[] = [];
  productosAgregados: ProductoAgregado[] = [];

  // Producto
  producto: Producto = {
    ID: 0,
    ID_IMPUESTO: 0,
    PORCENTAJE: 0,
    ID_TIPO_PRODUCTO: 0,
    NOMBRE: "",
    PRECIO: 0.00,
    EXENTA: false,
    DESCRIPCION: "",
    FECHA_INICIO: new Date(),
    FECHA_FINAL: new Date(),
    ESTADO: true,
    SIN_ESTADO: false,
    BEBIDA: false,
    IMAGEN: new Blob(),
    CREADO_POR: "",
    FECHA_CREACION: new Date(),
    MODIFICADO_POR: "string",
    FECHA_MODIFICACION: new Date()
  }

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  formularioProducto: FormGroup = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(100)]],
    cantidad: [1, [Validators.required, Validators.maxLength(100)]],
    informacion: ["", [Validators.required, Validators.maxLength(100)]],
    esBebida: ["", [Validators.required, Validators.maxLength(100)]],
    comerAqui: ["", [Validators.required, Validators.maxLength(100)]],
    bebida: ["", [Validators.required, Validators.maxLength(100)]]
  })

  filtrar(pantalla: string) {
    this.pantalla = pantalla;
  }

  constructor(private fb: FormBuilder, private categoriaService: CategoriaService, private authService: AuthService, private productoService: ProductoService, private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarCategoria();
    this.cargarTipoProducto();
    this.cargarBebidas();
  }

  ngAfterViewInit(): void {
    
    this.cargarProductos();
    
  }

  bgFiltro(pantalla: string):string {
    if(this.pantalla === pantalla) {
      return 'bg-dark';
    } else {
      return '';
    }
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

  
  seleccionarProducto( producto: Producto, click: MouseEvent ) {
    // Cambiar la pantalla
    this.producto = producto
    this.pantalla = 'Detalle del pedido'
    click.stopPropagation()

    // Cargar formulario
    this.formularioProducto.controls['nombre'].setValue(producto.NOMBRE);
    this.formularioProducto.controls['comerAqui'].setValue('1');
    this.formularioProducto.controls['cantidad'].setValue(1);
    this.formularioProducto.updateValueAndValidity();
  }

  volver( click: MouseEvent ) {
    this.pantalla = 'Menú'
    click.stopPropagation()
    this.formularioProducto.reset()
  }
  
  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  generarReporte() {
  }
  
  cargarBebidas() {
    this.pedidoService.getBebidas()
    .subscribe( resp => {
      this.listaBebida = resp.bebidas!;
    });
  }

  agregarProducto() {
    let {cantidad, informacion, comerAqui} = this.formularioProducto.value
    let comerAquiBoolean: boolean = true;

    if(comerAqui == '2') {
      comerAquiBoolean = false;
    }

    this.productosAgregados.push({
      producto: this.producto,
      cantidad: cantidad,
      informacion: informacion,
      comerAqui: comerAquiBoolean
    })
  }
  
  quitarProductoAgregado(index: number, click: MouseEvent) {
    this.productosAgregados.splice(index, 1);
    click.stopPropagation();
  }

}

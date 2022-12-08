import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../../../../catalogo-ventas/pages/gestion-categoria/services/categoria.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { Categoria } from '../../../../../catalogo-ventas/pages/gestion-categoria/interfaces/categoriaItems.interface';
import { Producto, TipoProducto } from '../../../../../catalogo-ventas/pages/gestion-productos/interfaces/producto.interfaces';
import { ProductoService } from '../../../../../catalogo-ventas/pages/gestion-productos/services/producto.service';
import { PedidoService } from '../../services/pedido.service';
import { ProductoAgregado } from '../../interfaces/pedido.interfaces';
import { MatButton } from '@angular/material/button';
import Swal from 'sweetalert2';
import { MatCheckbox } from '@angular/material/checkbox';
import { InputMayus } from '../../../../../../helpers/input-mayus';

@Component({
  selector: 'app-agregar-producto-pedido',
  templateUrl: './agregar-producto-pedido.component.html',
  styleUrls: ['./agregar-producto-pedido.component.css']
})
export class AgregarProductoPedidoComponent implements OnInit, AfterViewInit {

  toMayus = InputMayus.toMayus;

  get pedidoSeleccionado() {
    return this.pedidoService.pedidoSeleccionado;
  }

  // Componentes
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('categoria') categoria!: ElementRef;
  @ViewChild('tipoProducto') tipoProducto!: ElementRef;
  @ViewChild('bebida') bebida!: MatCheckbox;
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

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
    MODIFICACION_POR: "",
    FECHA_MODIFICACION: new Date()
  }

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  formularioProducto: FormGroup = this.fb.group({
    nombre:    [''],
    cantidad: [1, [Validators.required, Validators.maxLength(100)]],
    informacion: ["" ],
    comerAqui: ["", [Validators.required, Validators.maxLength(100)]],
    bebida: [""]
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
    this.editando = true;

    // Cambiar la pantalla
    this.producto = producto
    this.pantalla = 'Detalle del pedido'
    click.stopPropagation()

    // Cargar formulario
    this.formularioProducto.controls['nombre'].setValue(producto.NOMBRE);
    if(this.pedidoSeleccionado.TIPO=== "MOSTRADOR") {

      this.formularioProducto.controls['comerAqui'].setValue('2');

    } else {

      this.formularioProducto.controls['comerAqui'].setValue('1');

    }
    this.formularioProducto.controls['cantidad'].setValue(1);
    this.formularioProducto.controls['bebida'].setValue(false);
    this.formularioProducto.updateValueAndValidity();
  }

  volver( click: MouseEvent ) {
    this.pantalla = 'Menú'
    click.stopPropagation()
    this.formularioProducto.reset()
  }
  
  cerrar( click: MouseEvent ) {

    if(this.editando) {
      click.stopPropagation()
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
          this.editando = false;
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

  generarReporte() {
  }
  
  cargarBebidas() {
    this.pedidoService.getBebidas()
    .subscribe( resp => {
      this.listaBebida = resp.bebidas!;
    });
  }

  agregarProducto() {
    let {cantidad, informacion, comerAqui, bebida} = this.formularioProducto.value
    let comerAquiBoolean: boolean = false;

    if(comerAqui == '2') {
      comerAquiBoolean = true;
    }

    this.productosAgregados.push({
      producto: this.producto,
      cantidad: cantidad,
      informacion: informacion,
      comerAqui: comerAquiBoolean
    })

    // Agregar una bebida aparte del producto
    if(this.checked === true) {
      this.productosAgregados.push({
        producto: bebida,
        cantidad: 1,
        informacion: "",
        comerAqui: comerAquiBoolean
      })
    }

    this.checked = false;
  }
  
  quitarProductoAgregado(index: number, click: MouseEvent) {
    this.productosAgregados.splice(index, 1);
    click.stopPropagation();
  }

  async checkear(){
    if(this.checked) {
      this.checked = false
    } else {
      this.checked = true
    }
  }

  agregarTerminar() {
    if(!this.enEjecucion) {

      this.enEjecucion = true;
      this.agregarProducto();

      this.pedidoService.postDetalle(this.productosAgregados, this.pedidoService.pedidoSeleccionado.ID, this.authService.usuario.id_usuario)
        .subscribe(resp => {
          if(resp.ok === true) {
            this.enEjecucion = false;
            this.editando = false;
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
            this.enEjecucion = false;
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

}

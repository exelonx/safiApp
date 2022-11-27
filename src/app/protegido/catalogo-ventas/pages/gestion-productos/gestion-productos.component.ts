import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { ProductoService } from './services/producto.service';
import { Producto, TipoProducto } from './interfaces/producto.interfaces';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {

  @Output() onSeleccionar: EventEmitter<number> = new EventEmitter();
  @Output() onAbrirMenu: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('selectTipo') selectTipo!: ElementRef;

  constructor(private productoService: ProductoService, private usuario: AuthService, private pantalla: PermisosPantallaService, private fb: FormBuilder, private ingresosService: IngresosService) { }

  ngOnInit(): void {

    this.registrarIngreso();
    this.cargarRegistros();
    this.cargarTipoProducto();

  }

  seleccionarProducto(id: number) {
    this.onSeleccionar.emit( id )
  }

  toMayus = InputMayus.toMayusNoReactivo;
  
  ngOnDestroy(): void {
    // Destruir subscripciones
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    if (this.ingreso) {
      this.ingreso.unsubscribe();
    }
  }

  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos = controlar paginador y la tabla
  registros: Producto[] = [];
  tipoProducto: TipoProducto[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";
  titulo: number = 1;

  generando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  creando: boolean = false;
  editando: boolean = false;

  get getTipoProducto() {
    this.titulo = this.selectTipo.nativeElement.value;
    return this.selectTipo.nativeElement.value;
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.productoService.getProductos(1,id_usuario)
      .subscribe(
        resp => {
          console.log(resp)
          this.registros = this.productoService.productos
          this.tamano = resp.countProducto!
          this.limite = resp.limite!
        }
      )
  }

  getTitulo() {
    if (this.getTipoProducto) {
      if (this.getTipoProducto == 1) {
        return "Productos"
      }else if (this.getTipoProducto == 2){
        return "Combos"
      }else{
        return "Promociones"
      }
    }
    return ""
  }

  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;

      this.productoService.getReporte(buscar)
        .subscribe(res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          let PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;

          window.open(pdfUrl, '_blank');

          /* PDF_link.download = "Reporte de Productos.pdf";
          PDF_link.click() */;
          this.generando = false
        })

    }

  }

  // Cambiar de página
  cambioDePagina(evento: PageEvent) {

    console.log(this.selectTipo.nativeElement.value);

    // Hacer referencia al páginador
    this.paginadorPorReferencia = evento

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Si no se esta buscando no se envia nada
    if (!this.buscando) {
      buscar = ""
    }

    // Calcular posición de página
    let desde: string = (evento.pageIndex * evento.pageSize).toString();
    this.desde = desde;

    // Consumo
    this.subscripcion = this.productoService.getProductos(this.getTipoProducto,id_usuario, buscar, evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.productos!
          this.tamano = resp.countProducto!
          this.limite = resp.limite!
        }
      )
  }

  public get permisos() {
    return this.pantalla.permisos;
  }
  
  buscarRegistro() {
    // Si se ha cambiado el páginador
    if (this.paginadorPorReferencia) {
      this.indice = -1;
    }

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    const { buscar } = this.formularioBusqueda.value;

    // Para evitar conflictos con el páginador
    if (buscar !== "") {
      this.buscando = true
    } else {
      this.buscando = false
    }

    this.desde = "0"

    // Consumo
    this.subscripcion = this.productoService.getProductos(this.getTipoProducto,id_usuario, buscar)
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.productos!
          this.tamano = resp.countProducto!
          this.limite = resp.limite!
        }
      )
  }

  seleccionar(id_producto: number) {
    this.productoService.getProducto(id_producto)
      .subscribe(resq => {
        console.log(resq)
      })
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;
    
    // Consumo
    this.subscripcion = this.productoService.getProductos(this.getTipoProducto,id_usuario, buscar, this.limite.toString(), this.desde)
      .subscribe(
        resp => {
          this.registros = resp.productos!
          this.tamano = resp.countProducto!
          this.limite = resp.limite!
        }
      )
  }

  cargarTipoProducto(){
    this.productoService.getTipoProducto()
      .subscribe(
        resp => {
          this.tipoProducto = resp.tipoProducto!
        }
      )
  }

  // Para activar el modal de edición de sistema
  abrirMenu() {
    this.onAbrirMenu.emit(true)
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 18)
      .subscribe();

  }

  

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import Swal from 'sweetalert2';
import { Inventario } from './interfaces/inventario.interface';
import { inventarioService } from './services/inventario.service';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  @Output() onAbrirMenu: EventEmitter<boolean> = new EventEmitter();

  constructor(private pantalla: PermisosPantallaService, private inventarioService: inventarioService, private usuario: AuthService, 
    private permisoPantallaService: PermisosPantallaService, private fb: FormBuilder, 
    private ingresosService: IngresosService, private router: Router) { }

  // Atributos = controlar paginador y la tabla
  id_inventario: number = 0
  id_insumo: number = 0
  existencia: number = 0
  registros: Inventario[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";

  // Validador de busqueda
  buscando: boolean = false;
  generando: boolean = false;

  public get permisos() {
    return this.pantalla.permisos;
  }

  ngOnInit(): void {

    this.registrarIngreso()
    this.cargarRegistros();

  }

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

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.inventarioService.getInventario( id_usuario )
      .subscribe(
        resp => {
          this.registros = this.inventarioService.inventarios
          this.tamano = resp.countInventarios!
          this.limite = resp.limite!
        }
      )
  }

  // Cambiar de página
  cambioDePagina(evento: PageEvent) {

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
    this.subscripcion = this.inventarioService.getInventario(id_usuario, buscar, evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.inventarios!
          this.tamano = resp.countInventarios!
          this.limite = resp.limite!
        }
      )
  }

  // Cuando se presione Enter en la casilla buscar
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
    this.subscripcion = this.inventarioService.getInventario(id_usuario, buscar)
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.inventarios!
          this.tamano = resp.countInventarios!
          this.limite = resp.limite!
        }
      )
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.inventarioService.getInventario(id_usuario, buscar, this.limite.toString(), this.desde)
      .subscribe(
        resp => {
          this.registros = resp.inventarios!
          this.tamano = resp.countInventarios!
          this.limite = resp.limite!
          console.log(resp)
        }
      )
  }

  navegarKardex(id_insumo: number){
    this.router.navigateByUrl(`/main/inventario/kardex/${id_insumo}`)
  }


  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;

      this.inventarioService.getReporte(buscar)
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

  alertaNuevo(){

    Swal.fire({
      title: 'Advertencia',
      text: '¡Todos los insumos existentes ya se encuentran reflejados en la pantalla!',
      icon: 'warning',
      iconColor: 'white',
      background: '#008394',
      color: 'white',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    })

  }

  alertaEditar(){

    Swal.fire({
      title: 'Advertencia',
      text: '¡El inventario no se puede editar!',
      icon: 'warning',
      iconColor: 'white',
      background: '#008394',
      color: 'white',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    })

  }

  alertaEliminar(){

    Swal.fire({
      title: 'Advertencia',
      text: '¡El inventario no se puede eliminar!',
      icon: 'warning',
      iconColor: 'white',
      background: '#008394',
      color: 'white',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    })

  }

  // Para activar el modal de edición de sistema
  abrirMenu() {
    this.onAbrirMenu.emit(true)
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 28)
      .subscribe();

  }

}

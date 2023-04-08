import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import Swal from 'sweetalert2';
import { Estado } from './interfaces/estadoItems.interface';
import { EstadoService } from './services/estado.service';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent implements OnInit {

  constructor(private estadoService:EstadoService, private fb: FormBuilder, 
    private pantalla: PermisosPantallaService, private usuario: AuthService, private ingresosService: IngresosService) { }

  // Atributos = controlar paginador y la tabla
  id: number = 0
  registros: Estado[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";

  generando: boolean = false;

  creando: boolean = false;
  editando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  ngOnInit(): void {

    this.registrarIngreso()
    this.cargarRegistros();

  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    if (this.ingreso){
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
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.estadoService.getEstados( id_usuario )
      .subscribe(
        resp => {
          this.registros = this.estadoService.estados
          this.tamano = resp.countEstados!
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
    this.subscripcion = this.estadoService.getEstados(id_usuario, buscar, evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.estados!
          this.tamano = resp.countEstados!
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
    this.subscripcion = this.estadoService.getEstados(id_usuario, buscar)
    .subscribe(
      resp => {
        this.indice = 0;
        this.registros = resp.estados!
        this.tamano = resp.countEstados!
        this.limite = resp.limite!
      }
    )
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 25)
    .subscribe();

  }

  seleccionar(id_registro: number) {
    
    this.estadoService.getUnEstado(id_registro)
      .subscribe()
  }

  public get permisos() {
    return this.pantalla.permisos;
  }

  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;

      this.estadoService.getReporte(buscar, this.usuario.usuario.id_usuario)
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

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.estadoService.getEstados(id_usuario, buscar, this.limite.toString(), this.desde)
    .subscribe(
      resp => {
        this.registros = resp.estados!
        this.tamano = resp.countEstados!
        this.limite = resp.limite!
        /* console.log(resp) */
      }
    )
  }

  alertaNuevo(){

    Swal.fire({
      title: 'Advertencia',
      text: '¡No se puede crear un nuevo estado!',
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
      text: '¡No se puede eliminar un estado!',
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

}

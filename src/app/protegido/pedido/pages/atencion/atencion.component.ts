import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Mesa } from './interfaces/pedido.interfaces';
import { PedidoService } from './services/pedido.service';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/protegido/services/websocket.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.css']
})
export class AtencionComponent implements OnInit, OnDestroy {

  // Subscripciones
  mesasSubscripcion!: Subscription;
  ingreso!: Subscription;
  subsSocket1!: Subscription;
  subsSocket2!: Subscription;
  getMesaSub!: Subscription;
  getMesasSubs!: Subscription;

  // Atributos
  filtro: string = '';

  // Destruir y crear modales
  creando: boolean = false;
  agregando: boolean = false;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Para usarse en reportería
  generando: boolean = false;

  // Getters
  get mesas(): Mesa[] {
    return this.pedidoService.mesas
  }

  constructor( private pedidoService: PedidoService, private authService: AuthService, private fb: FormBuilder,
    private pantalla: PermisosPantallaService, public wsService: WebsocketService, private ingresosService: IngresosService ) { }

  ngOnInit(): void {
    this.registrarIngreso()
    this.cargarMesas()
    this.subsSocket1 = this.wsService.listen('mesa')
      .subscribe((resp: any) => {
      
        let id: number = resp.id
        this.getMesaSub = this.pedidoService.getMesa( id )
          .subscribe()  
        
      })

    this.subsSocket2 = this.wsService.listen('recargar')
      .subscribe((resp: any) => {

        this.cargarMesas();

      })
  }

  public get permisos() {
    return this.pantalla.permisos;
  }

  getFiltro( evento: string ) {
    this.filtro = evento;
  }

  cargarMesas() {
    this.mesasSubscripcion = this.pedidoService.getMesas()
      .subscribe()
  }

  ngOnDestroy(): void {
    if( this.mesasSubscripcion ) {
      this.mesasSubscripcion.unsubscribe();
    }
    
    if(this.ingreso) {
      this.ingreso.unsubscribe();
    }

    if(this.subsSocket1) {
      this.subsSocket1.unsubscribe()
    }

    if(this.subsSocket2) {
      this.subsSocket2.unsubscribe()
    }

    if(this.getMesaSub) {
      this.getMesaSub.unsubscribe()
    }
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.authService.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 30)
      .subscribe();

  }

  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;

      this.pedidoService.getReporte(buscar)
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

}

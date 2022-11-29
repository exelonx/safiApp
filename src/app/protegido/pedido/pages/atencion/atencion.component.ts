import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Mesa } from './interfaces/pedido.interfaces';
import { PedidoService } from './services/pedido.service';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/protegido/services/websocket.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { AuthService } from '../../../../auth/services/auth.service';

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

  // Para usarse en reportería
  generando: boolean = false;

  // Getters
  get mesas(): Mesa[] {
    return this.pedidoService.mesas
  }

  constructor( private pedidoService: PedidoService, private authService: AuthService,
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

}

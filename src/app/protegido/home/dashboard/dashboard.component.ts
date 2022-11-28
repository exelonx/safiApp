import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Caja } from '../../administracion/pages/caja/interface/cajaItems.interface';
import { CajaService } from '../../administracion/pages/caja/services/caja.service';
import { WebsocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  estadoCaja: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;

  constructor( private cajaService: CajaService, private usuario: AuthService, private ws: WebsocketService) {}

  ngOnInit(): void {

    console.log(this.cajaAbierta.ESTADO)

    // Lo que dice la función jaja
    this.cargarRegistro();

    this.ws.listen('cajaAbierta')
      .subscribe(() => {
        this.cargarRegistro();
      })

    this.ws.listen('cajaCerrada')
      .subscribe(() => {
        
        this.cargarRegistro();
        this.cajaService.cajaAbierta.ESTADO = false;
        
      })
    
  }

  public get cajaAbierta() : Caja {
    return this.cajaService.cajaAbierta;
    
  }

  
  /* public get CajasCerradas() : Caja[] {
    return this.cajaService.cajas;
  } */
  

  // Al entrar por primera vez a la pantalla
  cargarRegistro() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cajaService.getCajaAbierta( )
      .subscribe(
        resp => {

          /* if (this.cajaService.cajaAbierta.ESTADO == true) { */
            /* this.estadoCaja = true; */
          /* }
          else{

            this.estadoCaja = false;

          } */
          
        }
      )
  }

  // Al entrar por primera vez a la pantalla
  /* cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cajaService.getCajasCerradas( id_usuario )
      .subscribe(
        resp => {
          
          if (this.cajaService.cajaAbierta.ESTADO == false) {
            this.estadoCaja = false;
          }
          else{

            this.estadoCaja = true;

          }

        }
      )
  } */

}

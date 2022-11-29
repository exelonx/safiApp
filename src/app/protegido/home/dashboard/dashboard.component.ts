import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/auth/interfaces/Usuario.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Caja } from '../../administracion/pages/caja/interface/cajaItems.interface';
import { CajaService } from '../../administracion/pages/caja/services/caja.service';
import { PerfilUsuarioService } from '../../perfil-usuario/services/perfil-usuario.service';
import { WebsocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  estadoCaja: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;
  subsSocket1!: Subscription;
  subsSocket2!: Subscription;

  constructor( private cajaService: CajaService, private usuario: AuthService, private ws: WebsocketService, private authService: AuthService,
  private perfilService: PerfilUsuarioService) {}

  ngOnInit(): void {

    console.log(this.nombreUsuario.nombre)

    this.nombreUsuario;

    // Lo que dice la función jaja
    this.cargarRegistro();

    this.subsSocket1 = this.ws.listen('cajaAbierta')
      .subscribe(() => {
        this.cargarRegistro();
      })

    this.subsSocket2 = this.ws.listen('cajaCerrada')
      .subscribe(() => {
        
        this.cargarRegistro();
        this.cajaService.cajaAbierta.ESTADO = false;
        
      })
    
  }

  ngOnDestroy(): void {
    if(this.subsSocket1) {
      this.subsSocket1.unsubscribe()
    }

    if(this.subsSocket2) {
      this.subsSocket2.unsubscribe()
    }
    
  }

  public get cajaAbierta() : Caja {
    return this.cajaService.cajaAbierta;
    
  }

  
  public get nombreUsuario() : Usuario {
    return this.authService.usuario;
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

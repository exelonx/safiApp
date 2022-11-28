import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

  constructor( private cajaService: CajaService, private fb: FormBuilder, private usuario: AuthService, private ws: WebsocketService) {}

  ngOnInit(): void {

    console.log(this.cajaAbierta.ESTADO)

    // Lo que dice la función jaja
    this.cargarRegistro();

    this.ws.listen('estadoCaja')
      .subscribe(()=> {
        this.cargarRegistro();
      })
    
  }

  public get cajaAbierta() : Caja {
    return this.cajaService.cajaAbierta;
    
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistro() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cajaService.getCajaAbierta( )
      .subscribe(
        resp => {

          this.estadoCaja = true;
          
        }
      )
  }

}

import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../../auth/services/auth.service';
import { ListaPermisoResp } from '../notificacion/interfaces/permisoNoti.interface';
import { NotificacionesService } from '../notificacion/services/notificaciones.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor( public wsService: WebsocketService, private authService: AuthService, private notiService: NotificacionesService ) { }

  ngOnInit(): void {
    
    this.listenNotificaciones()

  }

  listenNotificaciones() {
    // Traer el rol del usuario logeado
    const idRol = this.authService.usuario.id_rol;
    let audio = new Audio();
    audio.src = "../assets/sound/tortuga.mp3"
    this.wsService.listen('notificar').subscribe( (listaPermisos) => {
      const permisos: any = listaPermisos!;

      
      for(let i = 0; i< permisos.permisos.length; i++) {

        if(permisos.permisos[i].ID_ROL === idRol) {
          this.notiService.recibirNotificacion(permisos.id_notificacion)
            .subscribe(() => {
              audio.load();
              audio.play();
            })
          break;
        }

      }
      
    } )
  }

}

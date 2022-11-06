import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('reproductorNotificaciones') reproductor!: ElementRef;

  constructor( public wsService: WebsocketService, private authService: AuthService, private notiService: NotificacionesService ) { }

  ngOnInit(): void {
    
    this.listenNotificaciones()

  }

  listenNotificaciones() {
    // Traer el rol del usuario logeado
    const idRol = this.authService.usuario.id_rol;
  
    // Escuchar evento para recibir notificaciones desde socket
    this.wsService.listen('notificar').subscribe( (listaPermisos) => {
      
      // Recibir lista de permisos
      const permisos: any = listaPermisos!;
      
      // Buscar si nuestro rol tiene permisos
      for(let i = 0; i< permisos.permisos.length; i++) {

        if(permisos.permisos[i].ID_ROL === idRol) {
          this.notiService.recibirNotificacion(permisos.id_notificacion)
            .subscribe(() => {
              this.reproductor.nativeElement.play()
            })
          break;
        }

      }
      
    })
  }

}

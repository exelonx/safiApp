import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../../auth/services/auth.service';
import { ListaPermisoResp } from '../notificacion/interfaces/permisoNoti.interface';
import { NotificacionesService } from '../notificacion/services/notificaciones.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SidenavService } from '../shared/sidenav/services/sidenav.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild('reproductorNotificaciones') reproductor!: ElementRef;

  constructor( private router: Router, private sidenavService: SidenavService, public wsService: WebsocketService, private authService: AuthService, private notiService: NotificacionesService ) { }

  ngOnInit(): void {
    
    this.listenNotificaciones()

  }

  ngOnDestroy(): void {
    if(this.subSocket1) {
      this.subSocket1.unsubscribe();
    }

    if(this.subSocket2) {
      this.subSocket2.unsubscribe();
    }
    
  }

  subSocket1!: Subscription;
  subSocket2!: Subscription;

  listenNotificaciones() {
    // Traer el rol del usuario logeado
    const idRol = this.authService.usuario.id_rol;
    const idUsuario = this.authService.usuario.id_usuario;

    this. subSocket1 = this.wsService.listen('backup').subscribe( (resp: any) => {
      if(resp.id_usuario != idUsuario) {
        this.cerrarSesion()
        Swal.fire({
          title: 'Atención',
          text: 'Se esta realizando un proceso de mantenimiento del sistema',
          icon: 'info',
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

    }) 
  
    // Escuchar evento para recibir notificaciones desde socket
    this. subSocket2 = this.wsService.listen('notificar').subscribe( (listaPermisos) => {
      
      // Recibir lista de permisos
      const permisos: any = listaPermisos!;
      
      // Recibir notificaciones si se esta logeado con el root
      if(idUsuario === 1) {
        this.notiService.recibirNotificacion(permisos.id_notificacion)
          .subscribe(() => {
            this.reproductor.nativeElement.play()
          })
      } else {  // NO ES ROOT
        
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

      }

      
    })
  }

  cerrarSesion() {
    this.sidenavService.eventoLogout(this.authService.usuario.id_usuario)
    .subscribe(resp=>{
      this.authService.cerrarSesion();
      this.router.navigateByUrl('/auth/login');
    });

  }

}

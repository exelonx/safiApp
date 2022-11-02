import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  notificacionCargada: boolean = false;

  constructor( private notificacionService: NotificacionesService,
    private router: Router ) {
      router.events.subscribe( ruta => {
        if(ruta instanceof NavigationEnd) {

          this.notificacionCargada = ruta.url.includes('notificaciones/')

        }
      })
    }

  notificaciones: any[] = []
  nueva() {
    let fecha = new Date()
    this.notificacionService.notificaciones.unshift({ACCION: 'prueba', DETALLE: 'prueba', ID_NOTIFICACION: 9, ID_TIPO_NOTIFICACION: 1, ID_USUARIO: 1, TIEMPO_TRANSCURRIDO: new Date(), TIPO_NOTIFICACION: 'aguacate', USUARIO: 'exe'})
  }

  ngOnInit(): void {
    this.notificaciones = this.notificacionService.notificaciones
  }

}

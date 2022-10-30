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
          console.log(ruta.url)

          this.notificacionCargada = ruta.url.includes('notificaciones/')
        }
      })
    }

  notificaciones: any[] = []
  nueva() {
    this.notificacionService.notificaciones.unshift({icono: 'inventory',mensaje: 'prueba', tiempo: '1 min'})
  }

  ngOnInit(): void {
    this.notificaciones = this.notificacionService.notificaciones
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionesService } from '../../notificacion/services/notificaciones.service';
import { NotificacionUsuario } from '../../notificacion/interfaces/notificaciones.interfaces';
import { interval } from 'rxjs';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-campana-notificacion',
  templateUrl: './campana-notificacion.component.html',
  styleUrls: ['./campana-notificacion.component.css']
})
export class CampanaNotificacionComponent implements OnInit {

  constructor( private notificacionService: NotificacionesService,
    private router: Router,
    private notiService: NotificacionesService ) { }

  notificaciones: NotificacionUsuario[] = [];

  ngOnInit(): void {
    this.cargarNotificaciones()
  }

  irNotificaciones() {
    this.router.navigateByUrl('/main/notificaciones')
  }

  cargarNotificaciones() {
    this.notificacionService.cargarNotificacionesCampana()
      .subscribe(
        () => {
          this.notificaciones = this.notiService.notificaciones

        }
      )
  }

}

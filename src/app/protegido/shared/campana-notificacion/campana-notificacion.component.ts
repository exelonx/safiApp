import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionesService } from '../../notificacion/services/notificaciones.service';

@Component({
  selector: 'app-campana-notificacion',
  templateUrl: './campana-notificacion.component.html',
  styleUrls: ['./campana-notificacion.component.css']
})
export class CampanaNotificacionComponent implements OnInit {

  constructor( private notificacionService: NotificacionesService,
    private router: Router ) { }
  notificaciones: any[] = [];

  ngOnInit(): void {
    this.notificaciones = this.notificacionService.notificaciones
  }

  irNotificaciones() {
    this.router.navigateByUrl('/main/notificaciones')
  }

}

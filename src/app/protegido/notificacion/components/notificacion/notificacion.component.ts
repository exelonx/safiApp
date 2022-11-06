import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NotificacionUsuario } from '../../interfaces/notificaciones.interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit, OnDestroy {

  notificacion!: NotificacionUsuario;

  //Subscripciones
  notificacionSubs!: Subscription;
  routerSubs!: Subscription;

  constructor(private notificacionService: NotificacionesService,
    private router: Router, private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarNotificacion()
  }

  cargarNotificacion() {
    let id_notificacion: string = ""

    // Subscribirse y leer el parametro de la ruta
    this.routerSubs = this.activatedRouter.params.subscribe(parametro => {
      id_notificacion = parametro['notificacion']

      // Consumir API
      this.notificacionSubs = this.notificacionService.verNotificacion(id_notificacion)
        .subscribe(resp => {
          if (resp.ok === true) {
            // Cargar notificación
            this.notificacion = resp.notificacion!;
          } else {
            // Salir del componente
            this.cerrarNotificacion()
          }
        })
        
    })

  }

  cerrarNotificacion() {
    this.router.navigateByUrl('/main/notificaciones')
  }

  ngOnDestroy(): void {
    if(this.notificacionSubs) {
      this.notificacionSubs.unsubscribe()
    }
    if(this.routerSubs) {
      this.routerSubs.unsubscribe()
    }
  }

}

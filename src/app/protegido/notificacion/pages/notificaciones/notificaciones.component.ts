import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NavigationEnd, Router } from '@angular/router';
import { NotificacionUsuario } from '../../interfaces/notificaciones.interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit, OnDestroy {

  notificacionCargada: boolean = false;

  // Subscripciones
  notificacionesSubs!: Subscription;
  lazyLoad!: Subscription;

  constructor( private notificacionService: NotificacionesService,
    private router: Router ) {
      router.events.subscribe( ruta => {
        if(ruta instanceof NavigationEnd) {

          this.notificacionCargada = ruta.url.includes('notificaciones/')

        }
      })
    }

  get notificaciones() {
    return this.notificacionService.notificaciones
  }

  nueva() {
    let fecha = new Date()
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    if(this.lazyLoad) {
      this.lazyLoad.unsubscribe();
    }
  }

  notificacionesLazyLoading() {
    console.log(this.notificaciones.length)
    this.lazyLoad = this.notificacionService.lazyLoadNotificaciones(this.notificaciones.length)
      .subscribe()
  }

  seleccionar(index: number) {
    if(!this.notificaciones[index].VISTO) {

      this.notificaciones[index].VISTO = true

    }
  }

}

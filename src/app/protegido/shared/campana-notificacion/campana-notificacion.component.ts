import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionesService } from '../../notificacion/services/notificaciones.service';
import { NotificacionUsuario } from '../../notificacion/interfaces/notificaciones.interfaces';
import { interval, Subscription } from 'rxjs';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-campana-notificacion',
  templateUrl: './campana-notificacion.component.html',
  styleUrls: ['./campana-notificacion.component.css']
})
export class CampanaNotificacionComponent implements OnInit, OnDestroy {

  @ViewChild('reproductorNotificaciones') reproductor!: ElementRef;

  notiSubs!: Subscription;
  lazyLoad!: Subscription;

  constructor( private notificacionService: NotificacionesService,
    private router: Router ) { }

  get notificaciones() {
    return this.notificacionService.notificaciones;
  }

  get notificacionesNoVistas() {
    return this.notificacionService.notificacionesNoVistas;
  }

  set notificacionSeleccionada(index: number) {
    if(!this.notificacionService.notificaciones[index].VISTO) {
      this.notificacionService.notificaciones[index].VISTO = true
    }
  }

  ngOnInit(): void {
    this.cargarNotificaciones()
  }

  irNotificaciones() {
    this.router.navigateByUrl('/main/notificaciones')
  }

  cargarNotificaciones() {
    this.notiSubs = this.notificacionService.cargarNotificacionesCampana()
      .subscribe()
  }

  notificacionesLazyLoading() {
    console.log(this.notificaciones.length)
    this.lazyLoad = this.notificacionService.lazyLoadNotificaciones(this.notificaciones.length)
      .subscribe()
  }

  verNotificacion(notificacionID: number, indice: number) {
    this.notificacionSeleccionada = indice
    this.reproductor.nativeElement.play()
    this.router.navigateByUrl(`/main/notificaciones/${notificacionID}`)
  }

  ngOnDestroy(): void {
    if(this.notiSubs) {
      this.notiSubs.unsubscribe()
    }
    
    if(this.lazyLoad) {
      this.lazyLoad.unsubscribe()
    }
  }

  evitarCierre(evento: MouseEvent) {
    evento.stopPropagation()
  }

  permitirCierre(evento: MouseEvent) {
    evento.preventDefault()
  }

}

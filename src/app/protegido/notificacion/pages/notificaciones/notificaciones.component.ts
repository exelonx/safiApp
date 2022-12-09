import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NavigationEnd, Router } from '@angular/router';
import { NotificacionUsuario } from '../../interfaces/notificaciones.interfaces';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit, OnDestroy {

  notificacionCargada: boolean = false;

  generando: boolean = false;

  // Subscripciones
  notificacionesSubs!: Subscription;
  lazyLoad!: Subscription;

  constructor( private notificacionService: NotificacionesService, private fb: FormBuilder,
    private router: Router, private authServices: AuthService) {
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
    this.lazyLoad = this.notificacionService.lazyLoadNotificaciones(this.notificaciones.length)
      .subscribe()
  }

  seleccionar(index: number) {
    if(!this.notificaciones[index].VISTO) {

      this.notificaciones[index].VISTO = true

    }
  }

  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let  id_usuario  = this.authServices.usuario.id_usuario;

      this.notificacionService.getReporte(id_usuario)
        .subscribe(res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          let PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;

          window.open(pdfUrl, '_blank');

          /* PDF_link.download = "Reporte de Unidades.pdf";
          PDF_link.click(); */
          this.generando = false
        })

    }

  }

}

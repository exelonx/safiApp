import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { PermisoNotificacion } from '../../../../interfaces/permiso.interfaces';
import { PermisoService } from '../../../../services/permiso.service';
import { AuthService } from '../../../../../../../../auth/services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-permiso-notificacion',
  templateUrl: './editar-permiso-notificacion.component.html',
  styleUrls: ['./editar-permiso-notificacion.component.css']
})
export class EditarPermisoNotificacionComponent implements OnInit {

  // Instancias de elementos HTML
  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('recibir') checkRecibir!: MatCheckbox;

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  get permiso(): PermisoNotificacion {
    return this.permisoService.permisoNoti;
  }

  // Subscripciones
  updateSubscripcion!: Subscription;

  enEjecucion: boolean = false;

  constructor( private permisoService: PermisoService, private authService: AuthService ) { }

  ngOnInit(): void {
  }

  actualizar() {

    const id_usuario: number = this.authService.usuario.id_usuario;
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.updateSubscripcion = this.permisoService.putPermisoNotificacion(id_usuario, this.permiso.ID, this.checkRecibir.checked)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.enEjecucion = false
              this.cerrarEditar._elementRef.nativeElement.click()
              Swal.fire({
                title: '¡Éxito!',
                text: resp.msg,
                icon: 'success',
                iconColor: 'white',
                background: '#a5dc86',
                color: 'white',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 4500,
                timerProgressBar: true,
              })
            } else {
              this.enEjecucion = false
              Swal.fire({
                title: 'Advertencia',
                text: resp,
                icon: 'warning',
                iconColor: 'white',
                background: '#f8bb86',
                color: 'white',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 4500,
                timerProgressBar: true,
              })
            }
          })
        )
    }
  };

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 500);
  }

  ngOnDestroy(): void {
    if(this.updateSubscripcion) {
      this.updateSubscripcion.unsubscribe()
    }
    this.cerrarEditar._elementRef.nativeElement.click()
  }

}

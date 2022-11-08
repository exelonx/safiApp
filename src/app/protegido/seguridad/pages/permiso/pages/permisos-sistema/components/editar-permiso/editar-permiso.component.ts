import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { PermisoService } from '../../../../services/permiso.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-editar-permiso',
  templateUrl: './editar-permiso.component.html',
  styleUrls: ['./editar-permiso.component.css']
})
export class EditarPermisoComponent implements OnInit, OnDestroy {

  // Instancias de elementos HTML
  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('consultar') checkConsultar!: MatCheckbox;
  @ViewChild('editar') checkActualizar!: MatCheckbox;
  @ViewChild('guardar') checkGuardar!: MatCheckbox;
  @ViewChild('eliminar') checkEliminar!: MatCheckbox;

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  
  constructor(private permisoService: PermisoService, private authService: AuthService) { }

  get permiso() {
    return this.permisoService.permiso;
  }

  ngOnInit(): void {
  }

  enEjecucion: boolean = false;

  // Subscripciones
  updateSubscripcion!: Subscription;

  actualizar() {

    const id_usuario: number = this.authService.usuario.id_usuario;
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.updateSubscripcion = this.permisoService.putPermiso(id_usuario, this.permiso.ID_PERMISO, this.checkGuardar.checked, this.checkEliminar.checked, this.checkActualizar.checked, this.checkConsultar.checked)
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
    
  }

}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-eliminar-proveedor',
  templateUrl: './eliminar-proveedor.component.html',
  styleUrls: ['./eliminar-proveedor.component.css']
})
export class EliminarProveedorComponent implements OnInit {

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  
  @ViewChild('cerrarEliminar') cerrarEliminar!: MatButton;

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get proveedor(){
    return this.proveedorService.proveedor;
  }

  constructor(private proveedorService: ProveedorService, private authService: AuthService) { }

  eliminarProveedor() {

    if (!this.enEjecucion) {
      this.enEjecucion = true;
      const quienElimina = this.authService.usuario.id_usuario;

      this.subscripcion = this.proveedorService.eliminarRol(this.proveedor.ID, quienElimina)
        .subscribe(resp => {
          if (resp.ok === true) {
            this.onEliminar.emit();
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
            this.enEjecucion = false;
          } else {
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
            this.enEjecucion = false;
          }
        })
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    };

    this.cerrarEliminar._elementRef.nativeElement.click()
  }


}

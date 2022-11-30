import { Component, EventEmitter, OnInit, Output, OnDestroy, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DescuentoService } from '../../services/descuento.service';

@Component({
  selector: 'app-eliminar-descuento',
  templateUrl: './eliminar-descuento.component.html',
  styleUrls: ['./eliminar-descuento.component.css']
})
export class EliminarDescuentoComponent implements OnInit, OnDestroy {

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get descuento(){
    return this.descuentoService.descuento;
  }

  constructor(private descuentoService: DescuentoService, private authService: AuthService) { }

  
  @ViewChild('cerrarEliminar') cerrarEliminar!: MatButton;

  eliminarDescuento() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.descuentoService.deleteDescuento(this.descuento.ID, quienElimina)
        .subscribe(resp => {
          if(resp.ok === true) {
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

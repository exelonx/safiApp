import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../services/compras.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-eliminar-compra',
  templateUrl: './eliminar-compra.component.html',
  styleUrls: ['./eliminar-compra.component.css']
})
export class EliminarCompraComponent implements OnInit {

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 
  
  @ViewChild('cerrarEliminar') cerrarEliminar!: MatButton;

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get compra(){
    return this.compraService.compra;
  }

  constructor( private compraService: ComprasService, private authService: AuthService ) { }

  anularCompra() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.compraService.anularCompra(this.compra.ID, quienElimina)
        .subscribe(resp => {
          this.onEliminar.emit();
          if(resp.ok === true) {
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
    
    this.cerrarEliminar._elementRef.nativeElement.click()
    
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto.interfaces';

@Component({
  selector: 'app-eliminar-producto',
  templateUrl: './eliminar-producto.component.html',
  styleUrls: ['./eliminar-producto.component.css']
})
export class EliminarProductoComponent implements OnInit {

  @Output() onEliminar: EventEmitter<void> = new EventEmitter();

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get producto() {
    return this.productoService.producto;
  }

  constructor(private productoService: ProductoService, private authService: AuthService) { }

  eliminarProducto() {

    if (!this.enEjecucion) {
      this.enEjecucion = true;

      const quienElimina = this.authService.usuario.id_usuario;

      this.subscripcion = this.productoService.deleteProducto(this.producto.ID, quienElimina)
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
  }

}

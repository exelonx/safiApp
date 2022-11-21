import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-eliminar-categoria',
  templateUrl: './eliminar-categoria.component.html',
  styleUrls: ['./eliminar-categoria.component.css']
})
export class EliminarCategoriaComponent implements OnInit {

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get categoria(){
    return this.categoriaService.categoria;
  }

  constructor(private categoriaService: CategoriaService, private authService: AuthService) { }

  eliminarCategoria() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.categoriaService.eliminarCategoria(this.categoria.ID, quienElimina)
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
  }

}

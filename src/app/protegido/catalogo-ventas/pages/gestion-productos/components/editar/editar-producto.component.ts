import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto.interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  constructor(private productoService: ProductoService, private pantalla:PermisosPantallaService, private fb: FormBuilder, private authService: AuthService) { }

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('nombre') nombre!: ElementRef;
  @ViewChild('unidadMedida') unidadMedida!: ElementRef;

   // Propiedad para evitar doble ejecuciones al cliclear más de una vez
   enEjecucion: boolean = false;
   cambiandoContra: boolean = false;

   // Subscripciones
  subscripcion!: Subscription;
  
  get producto() {
    return this.productoService.producto
  }

  toMayus = InputMayus.toMayusNoReactivo;

  ngOnInit(): void {
  }

  actualizarProducto() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario;

      const nombre = this.nombre.nativeElement.value;
      const unidadMedida = this.unidadMedida.nativeElement.value;

      /* this.productoService.putProducto()
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
           
            if(resp.ok === true) {
              this.cerrarEditar._elementRef.nativeElement.click();
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
        ) */
    }  
  };

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

}

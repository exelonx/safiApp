import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { Categoria } from '../../interfaces/categoriaItems.interface';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('inputCategoria') inputCategoria!: ElementRef;

  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  enEjecucion: boolean = false;

  constructor(private categoriaService: CategoriaService, private fb: FormBuilder, private usuario: AuthService) { }

  ngOnInit(): void {
  }

  actualizar() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const nombre = this.inputCategoria.nativeElement.value;/* this.formularioRol.value.rol === "" ? this.rol :  this.formularioRol.value.rol */
      const id_usuario = this.usuario.usuario.id_usuario;
      
      this.categoriaService.actualizarCatalogo(this.categoria.ID, nombre, id_usuario)
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
        )

    }
      
  };

  
  public get categoria() : Categoria {
    return this.categoriaService.categoria;
  }
  

  toMayus = InputMayus.toMayusNoReactivo;

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

}

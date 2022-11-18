import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../interfaces/proveedorItems.interface';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.css']
})
export class EditarProveedorComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('inputNombre') inputNombre!: ElementRef;
  @ViewChild('inputDetalle') inputDetalle!: ElementRef;
  @ViewChild('inputTelefono') inputTelefono!: ElementRef;

  
  public get proveedor() : Proveedor {

    return this.proveedorService.proveedor

  }
  
  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  enEjecucion: boolean = false;

  constructor(private proveedorService: ProveedorService, private fb: FormBuilder, private usuario: AuthService) { }

  ngOnInit(): void {
  }

  actualizar() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const nombre = this.inputNombre.nativeElement.value;/* this.formularioRol.value.rol === "" ? this.rol :  this.formularioRol.value.rol */
      const detalle = this.inputDetalle.nativeElement.value;/*  === "" ? this.descripcion : this.formularioRol.value.descripcion */
      const telefono = this.inputTelefono.nativeElement.value;
      const id_usuario = this.usuario.usuario.id_usuario;
      
      this.proveedorService.actualizarProveedor(this.proveedor.ID, nombre, detalle, telefono, id_usuario)
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

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

  toMayus = InputMayus.toMayusNoReactivo;


}

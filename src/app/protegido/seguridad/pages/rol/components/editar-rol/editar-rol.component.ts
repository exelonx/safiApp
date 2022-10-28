import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { MatButton } from '@angular/material/button';
import { InputMayus } from '../../../../../../helpers/input-mayus';

@Component({
  selector: 'app-editar-rol',
  templateUrl: './editar-rol.component.html',
  styleUrls: ['./editar-rol.component.css']
})
export class EditarRolComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;

  @Input() id: number = 0;
  @Input() rol: string = "";
  @Input() descripcion: string = "";

  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();

  enEjecucion: boolean = false;

  constructor(private rolService: RolService, private fb: FormBuilder, private usuario: AuthService) { }

  // Formulario
  formularioRol: FormGroup = this.fb.group({
    rol:    ['', [Validators.required, Validators.maxLength(100)]],
    descripcion:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  ngOnInit(): void {
  }

  actualizar() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const rol = this.formularioRol.value.rol === "" ? this.rol :  this.formularioRol.value.rol;
      const descripcion = this.formularioRol.value.descripcion === "" ? this.descripcion : this.formularioRol.value.descripcion;
      const id_usuario = this.usuario.usuario.id_usuario;
      
      this.rolService.actualizarRol(this.id, rol, descripcion, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.cerrarEditar._elementRef.nativeElement.click();
              Swal.fire('¡Éxito!', resp.msg, 'success')
              this.enEjecucion = false;
            } else {
              Swal.fire('Error', resp, 'warning')
              this.enEjecucion = false;
            }
          })
        )

    }
      
  };

  toMayus = InputMayus.toMayus;

  limpiarFormulario() {

    this.formularioRol.controls['rol'].setValue(this.rol)
    this.formularioRol.controls['descripcion'].setValue(this.descripcion)

  }

}

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { CAIService } from '../../services/cai.service';

@Component({
  selector: 'app-editar-cai',
  templateUrl: './editar-cai.component.html',
  styleUrls: ['./editar-cai.component.css']
})
export class EditarCAIComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('CAI') CAI!: ElementRef;
  @ViewChild('fecha_autorizada') fecha_autorizada!: ElementRef;
  @ViewChild('fecha_limite') fecha_limite!: ElementRef;
  @ViewChild('rango_maximo') rango_maximo!: ElementRef;
  @ViewChild('rango_minimo') rango_minimo!: ElementRef;
  @ViewChild('numero_actual') numero_actual!: ElementRef;



  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();

  enEjecucion: boolean = false;
  editandoProveedor: boolean = false;

  get cai() {
    return this.caiService.cai;
  }

  formularioEdicion: FormGroup = this.fb.group({
    cai:    [[Validators.required, Validators.maxLength(45)]],
    // rango_minimo: ['', [Validators.required, Validators.maxLength(45)]],
    // rango_maximo: ['', [Validators.required, Validators.maxLength(45)]],
    fecha_autorizada:    ['', [Validators.required]],
    // fecha_limite: ['', [Validators.required]]
    
  })
  
  constructor(private caiService: CAIService, private authService: AuthService, private fb: FormBuilder) { }

  actualizarCAI() {

    if (!this.enEjecucion) {
      this.enEjecucion = true;
      console.log(this.fecha_limite.nativeElement.value)

      const id_usuario = this.authService.usuario.id_usuario;

      const CAI = this.CAI.nativeElement.value;
      const rango_minimo = this.rango_minimo.nativeElement.value;
      const rango_maximo = this.rango_maximo.nativeElement.value;
      const fecha_autorizada = this.fecha_autorizada.nativeElement.value;
      const fecha_limite = this.fecha_limite.nativeElement.value;
      const numero_actual = this.numero_actual.nativeElement.value;

      this.caiService.putCAI(this.cai.ID, CAI, rango_minimo, rango_maximo, fecha_autorizada, fecha_limite, numero_actual, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();

            if (resp.ok === true) {
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


  toMayus = InputMayus.toMayusNoReactivo;

  ngOnInit(): void {
    console.log(this.cai)
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

}

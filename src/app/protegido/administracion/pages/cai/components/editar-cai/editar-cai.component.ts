import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
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
export class EditarCAIComponent implements OnInit, OnDestroy {

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
    rango_minimo: ['', [Validators.required, Validators.maxLength(45)]],
    rango_maximo: ['', [Validators.required, Validators.maxLength(45)]],
    fecha_autorizada:    [[Validators.required]],
    fecha_limite: ['', [Validators.required]],
    numeroActual: ['', [Validators.required]]
    
  })
  
  constructor(private caiService: CAIService, private authService: AuthService, private fb: FormBuilder) { }
  
  ngOnDestroy(): void {
    
    this.cerrarEditar._elementRef.nativeElement.click()
    
  }

  actualizarCAI() {

    if (!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario;

      const { cai, rango_minimo, rango_maximo, fecha_autorizada, fecha_limite, numeroActual } = this.formularioEdicion.value

      this.caiService.putCAI(this.cai.ID, cai, rango_minimo, rango_maximo, fecha_autorizada, fecha_limite, numeroActual, id_usuario)
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
    setTimeout(() => {
      
    }, 500);
  }

  // NO BORRAR O TE DISPARO!!
  actualizarFormulario() {
    this.formularioEdicion.controls['cai'].setValue(this.cai.CAI)
    this.formularioEdicion.controls['cai'].updateValueAndValidity()
    this.formularioEdicion.controls['fecha_autorizada'].setValue(this.cai.FECHA_AUTORIZADO)
    this.formularioEdicion.controls['fecha_autorizada'].updateValueAndValidity()
    this.formularioEdicion.controls['numeroActual'].setValue(this.cai.NUMERO_ACTUAL)
    this.formularioEdicion.controls['numeroActual'].updateValueAndValidity()
    this.formularioEdicion.controls['rango_minimo'].setValue(this.cai.RANGO_MINIMO)
    this.formularioEdicion.controls['rango_minimo'].updateValueAndValidity()
    this.formularioEdicion.controls['rango_maximo'].setValue(this.cai.RANGO_MAXIMO)
    this.formularioEdicion.controls['rango_maximo'].updateValueAndValidity()
    this.formularioEdicion.controls['fecha_limite'].setValue(this.cai.FECHA_LIMITE_EMISION)
    this.formularioEdicion.controls['fecha_limite'].updateValueAndValidity()
    this.formularioEdicion.updateValueAndValidity();
    console.log(this.formularioEdicion.value)
    console.log(this.formularioEdicion.invalid)
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }


}

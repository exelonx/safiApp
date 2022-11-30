import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CAIService } from '../../services/cai.service';
import { PermisosPantallaService } from '../../../../../services/permisos-pantalla.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { IngresosService } from '../../../../../services/ingresos.service';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { InputMayus } from 'src/app/helpers/input-mayus';

@Component({
  selector: 'app-nuevo-cai',
  templateUrl: './nuevo-cai.component.html',
  styleUrls: ['./nuevo-cai.component.css']
})
export class NuevoCAIComponent implements OnInit {

  constructor(private caiService: CAIService, private pantalla: PermisosPantallaService, private fb: FormBuilder, private authService: AuthService,
    private ingresosService: IngresosService) { }

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  // public customPatterns = { 'A': { pattern: new RegExp('/^([A-Z0-9]{6}\-){5}([A-Z0-9]{2})$/')} };

  // public customPatternsDigitos = { '0': { pattern: new RegExp('/^(\d{3}\-){2}\d{2}\-\d{8}$/')} };

  // Formulario
  formularioCreacion: FormGroup = this.fb.group({
    cai:    ['', [Validators.required, Validators.maxLength(45)]],
    rango_minimo: ['', [Validators.required, Validators.maxLength(45)]],
    rango_maximo: ['', [Validators.required, Validators.maxLength(45)]],
    fecha_autorizada:    ['', [Validators.required]],
    fecha_limite: ['', [Validators.required]]
    
  })

  crearCAI() {
    if( !this.enEjecucion ) {
      const {cai, rango_minimo, rango_maximo, fecha_autorizada, fecha_limite} = this.formularioCreacion.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.caiService.postCAI(cai, rango_minimo.toString(), rango_maximo.toString(), fecha_autorizada, fecha_limite,  id_usuario.toString())
      .subscribe(resp => {
        this.onCrear.emit();
        if(resp.ok === true) {
          this.enEjecucion = false
          this.cerrarCrear._elementRef.nativeElement.click()
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
        } else {
          this.enEjecucion = false
          Swal.fire({
            title: 'Advertencia',
            text: resp.msg,
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
        }
      })
    }
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  toMayus = InputMayus.toMayus;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    
    this.cerrarCrear._elementRef.nativeElement.click()
    
  }

}

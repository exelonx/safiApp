import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { UnidadService } from '../../services/unidad.service';

@Component({
  selector: 'app-nueva-unidad',
  templateUrl: './nueva-unidad.component.html',
  styleUrls: ['./nueva-unidad.component.css']
})
export class NuevaUnidadComponent implements OnInit {

  constructor(private unidadService: UnidadService, private pantalla:PermisosPantallaService, private fb: FormBuilder, private authService: AuthService) { }

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

   // Propiedad para evitar doble ejecuciones al cliclear más de una vez
   enEjecucion: boolean = false;
   cambiandoContra: boolean = false;

   // Subscripciones
  subscripcion!: Subscription;

  // Formulario
  formularioCreacion: FormGroup = this.fb.group({
    nombre:             ['', [Validators.required]],
    unidad_de_medida:    ['', [Validators.required]],    
  })
  
  toMayus = InputMayus.toMayus;

  ngOnInit(): void {
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

}

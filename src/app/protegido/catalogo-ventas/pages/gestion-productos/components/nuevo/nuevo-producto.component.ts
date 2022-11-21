import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { InputMayus } from 'src/app/helpers/input-mayus';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  hide = true;
  
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

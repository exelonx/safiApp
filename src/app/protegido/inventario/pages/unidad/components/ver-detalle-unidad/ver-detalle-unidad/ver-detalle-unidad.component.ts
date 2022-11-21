import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { UnidadService } from '../../../services/unidad.service';

@Component({
  selector: 'app-ver-detalle-unidad',
  templateUrl: './ver-detalle-unidad.component.html',
  styleUrls: ['./ver-detalle-unidad.component.css']
})
export class VerDetalleUnidadComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();


  /* listaUnidad: Unidad[] = []; */

  enEjecucion: boolean = false;
  constructor(private unidadService:UnidadService, private authService: AuthService, private fb: FormBuilder) { }

  toMayus = InputMayus.toMayus;

  get unidad() {
    return this.unidadService.unidad;
  }
  
  ngOnInit(): void {
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

}

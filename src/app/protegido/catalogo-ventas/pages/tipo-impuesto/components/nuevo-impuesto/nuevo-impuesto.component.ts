import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nuevo-impuesto',
  templateUrl: './nuevo-impuesto.component.html',
  styleUrls: ['./nuevo-impuesto.component.css']
})
export class NuevoImpuestoComponent implements OnInit {

  enEjecucion: boolean = false;

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}

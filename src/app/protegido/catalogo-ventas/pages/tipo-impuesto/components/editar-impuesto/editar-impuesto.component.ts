import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-impuesto',
  templateUrl: './editar-impuesto.component.html',
  styleUrls: ['./editar-impuesto.component.css']
})
export class EditarImpuestoComponent implements OnInit {

  enEjecucion: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

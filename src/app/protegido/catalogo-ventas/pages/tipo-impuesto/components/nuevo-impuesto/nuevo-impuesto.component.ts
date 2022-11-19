import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-impuesto',
  templateUrl: './nuevo-impuesto.component.html',
  styleUrls: ['./nuevo-impuesto.component.css']
})
export class NuevoImpuestoComponent implements OnInit {

  enEjecucion: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

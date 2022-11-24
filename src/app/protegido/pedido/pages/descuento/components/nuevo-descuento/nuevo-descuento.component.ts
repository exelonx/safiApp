import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-descuento',
  templateUrl: './nuevo-descuento.component.html',
  styleUrls: ['./nuevo-descuento.component.css']
})
export class NuevoDescuentoComponent implements OnInit {

  enEjecucion: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

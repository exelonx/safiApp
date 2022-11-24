import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-descuento',
  templateUrl: './descuento.component.html',
  styleUrls: ['./descuento.component.css']
})
export class DescuentoComponent implements OnInit {

  generando: boolean = false;
  creando: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

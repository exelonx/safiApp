import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cambio-por-correo',
  templateUrl: './cambio-por-correo.component.html',
  styleUrls: ['./cambio-por-correo.component.css']
})
export class CambioPorCorreoComponent implements OnInit {

  hideContra: boolean = true;
  hideRepetir: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}

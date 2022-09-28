import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  constructor() { }

  hideContrasena: boolean = true;
  hideVerificar: boolean = true;

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario = {
    nombre: 'Pedro',
    apellido: '',
    email: '',
    numero: '',
    usuario: '',
    pregunta: [],
    rol: ''
  }

  notificaciones: any[] = [];


  constructor() { }

  ngOnInit(): void {
  }

}

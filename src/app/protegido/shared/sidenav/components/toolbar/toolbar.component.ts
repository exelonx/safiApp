import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  nombre!: string;

  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    numero: '',
    usuario: '',
    pregunta: [],
    rol: ''
  }

  notificaciones: any[] = [];


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getPrimerNombre()
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }

  getPrimerNombre() {
    const nombre: string[] = this.authService.usuario.nombre.split(" ")
    this.nombre = nombre[0];
  }

}

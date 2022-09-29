import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

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


  constructor( private authService: AuthService, private router: Router ) { }

  ngOnInit(): void {
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }

}

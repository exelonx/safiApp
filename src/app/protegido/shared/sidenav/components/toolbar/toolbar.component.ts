import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  get nombre(): string {
    return this.authService.nombreMutable;
  }

  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    numero: '',
    usuario: '',
    pregunta: [],
    rol: ''
  }

  notificaciones: any[] = [{mensaje: 'hola mundo', tiempo: '2 min'}, {mensaje: 'hola mundo', tiempo: '2 min'}];


  constructor(private authService: AuthService, private router: Router, private sidenavService: SidenavService) { }

  ngOnInit(): void {
    this.getPrimerNombre()
  }

  cerrarSesion() {
    this.sidenavService.eventoLogout(this.authService.usuario.id_usuario)
    .subscribe(resp=>{
      this.authService.cerrarSesion();
      this.router.navigateByUrl('/auth/login');
    });

  }

  getPrimerNombre() {
    const nombre: string[] = this.authService.usuario.nombre.split(" ")
  }

}

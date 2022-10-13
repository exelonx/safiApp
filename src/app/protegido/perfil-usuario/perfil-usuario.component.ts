import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';


@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  get usuario() {
    return this.authService.usuario;
  }

  constructor(private router: Router,
    private authService: AuthService) { }

    panelOpenState = false;
    hideContra: boolean = true;
    hideRepetir: boolean = true;

  ngOnInit(): void {
  }
}

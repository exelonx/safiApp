import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private authService: AuthService,
    private _formBuilder: FormBuilder) { }

  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: ['', Validators.required] });
  secondFormGroup: FormGroup = this._formBuilder.group({ secondCtrl: ['', Validators.required] });
  
  hideContra: boolean = true;
  hideRepetir: boolean = true;
  /* panelOpenState = false; */

  ngOnInit(): void {
  }
}

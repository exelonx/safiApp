import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BackupService } from '../../services/backup.service';

@Component({
  selector: 'app-restaurar-backup',
  templateUrl: './restaurar-backup.component.html',
  styleUrls: ['./restaurar-backup.component.css']
})
export class RestaurarBackupComponent implements OnInit {

  formularioConexion: FormGroup = this.fb.group({
    // Arreglo de formularios
    servidor: ['',[Validators.required]],
    base: ['',[Validators.required]],
    usuario: ['',[Validators.required]],
    contrasena: ['',[Validators.required]]
  })

  formularioRespaldo: FormGroup = this.fb.group({
    // Arreglo de formularios
    tamano: ['',[Validators.required]],
    nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]+$')]],
    ubicacion: ['', [Validators.maxLength(20)]]
  })

  conectado: boolean = false;

  constructor(private backupService: BackupService, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarParametros()
  }

  cargarParametros(){
    this.backupService.getParametros()
      .subscribe(rest => {
        this.formularioConexion.controls['servidor'].setValue(rest.host)
        this.formularioConexion.controls['base'].setValue(rest.database)
        this.formularioConexion.controls['usuario'].setValue(rest.user)
        this.formularioConexion.controls['contrasena'].setValue(rest.password)
        this.formularioRespaldo.get('tamano')?.disable()
        this.formularioRespaldo.get('ubicacion')?.disable()
        this.formularioRespaldo.get('nombre')?.disable()
        this.formularioConexion.updateValueAndValidity()
      })
  }

}

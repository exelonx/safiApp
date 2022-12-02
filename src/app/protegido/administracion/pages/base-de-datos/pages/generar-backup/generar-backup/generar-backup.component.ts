import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BackupService } from '../../../services/backup.service';

@Component({
  selector: 'app-generar-backup',
  templateUrl: './generar-backup.component.html',
  styleUrls: ['./generar-backup.component.css']
})
export class GenerarBackupComponent implements OnInit {
  
  @ViewChild('servidor') servidor!: ElementRef
  @ViewChild('base') base!: ElementRef
  @ViewChild('usuario') usuario!: ElementRef
  @ViewChild('contrasena') contrasena!: ElementRef
  @ViewChild('tamano') tamano!: ElementRef

  hideContrasena: boolean = false;

  constructor(private backupService: BackupService) { }

  cargarParametros(){
    this.backupService.getParametros()
      .subscribe(rest => {
        this.servidor.nativeElement.value = rest.host!
        this.base.nativeElement.value = rest.database!
        this.usuario.nativeElement.value = rest.user!
        this.contrasena.nativeElement.value = rest.password!
        this.tamano.nativeElement.value = rest.result! + ' MB'
      })
  }

  ngOnInit(): void {
    this.cargarParametros()
  }

}

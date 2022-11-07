import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generar-backup',
  templateUrl: './generar-backup.component.html',
  styleUrls: ['./generar-backup.component.css']
})
export class GenerarBackupComponent implements OnInit {

  hideContrasena: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { ParametroService } from './services/parametro.service';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['../usuario/usuario.component.css']
})

export class ParametroComponent implements OnInit {

  parametroData = this.parametroService.parametroData; 

  constructor(private parametroService:ParametroService) { }

  ngOnInit(): void {
  }

}

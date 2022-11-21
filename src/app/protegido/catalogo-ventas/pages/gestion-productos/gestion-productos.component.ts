import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {

    // Referencia para páginador
    creando: boolean = false;
    generando: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  

}

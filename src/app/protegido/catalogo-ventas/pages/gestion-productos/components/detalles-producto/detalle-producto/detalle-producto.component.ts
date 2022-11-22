import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

  constructor(private productoService: ProductoService) { }

  get producto() {
    return this.productoService.producto;
  }

  ngOnInit(): void {
  }

}

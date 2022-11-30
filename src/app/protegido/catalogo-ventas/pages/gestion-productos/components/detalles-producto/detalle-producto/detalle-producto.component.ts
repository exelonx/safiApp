import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

  
  @ViewChild('cerrarDetalle') cerrarDetalle!: MatButton;

  constructor(private productoService: ProductoService) { }

  get producto() {
    return this.productoService.producto;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    
    this.cerrarDetalle._elementRef.nativeElement.click()
    
  }

}

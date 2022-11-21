import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-atencion',
  templateUrl: './tabla-atencion.component.html',
  styleUrls: ['./tabla-atencion.component.css']
})
export class TablaAtencionComponent implements OnInit {

  @Input() load: boolean = false; //Para hacer lazy-load de los datos
  @Input() pedido!: any;
  detalles: any[] = [];

  constructor( ) { }

  ngOnInit(): void {
    this.cargarDetalleEnTabla()
  }

  getColorPlato(paraLlevar: boolean): string {
    if(paraLlevar){
      return 'llevar'
    } else {
      return 'noLlevar'
    }
  }

  getTotalMesa() {
    let total: number = 0;
    this.detalles.forEach(producto => {
      total += (producto.PRECIO_PRODUCTO * producto.CANTIDAD);
    });
    return total;
  }

  cargarDetalleEnTabla() {
    
  }

}

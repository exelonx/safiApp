import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Insumo, InsumoResp } from '../../../insumo/interfaces/insumo.interface';
import { InsumoService } from '../../../insumo/services/insumo.service';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-ver-compra',
  templateUrl: './ver-compra.component.html',
  styleUrls: ['./ver-compra.component.css']
})
export class VerCompraComponent implements OnInit {

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  
  @ViewChild('cerrarDetalle') cerrarDetalle!: MatButton;
  listaInsumo: Insumo[] = [];

  constructor( private compraService: ComprasService, private authService: AuthService, private insumoService: InsumoService ) { }

  get compra() {
    return this.compraService.compra;
  }

  get detalle() {
    return this.compraService.detalleCompra;
  }

  cargarInsumos() {
    const usuario = this.authService.usuario.id_usuario;
    this.insumoService.getInsumos(usuario, "", '9999')
      .subscribe((insumo: InsumoResp) => {
        this.listaInsumo = insumo.insumos!;
      });
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

  ngOnInit(): void {
    this.cargarInsumos()
  }

  ngOnDestroy(): void {
    
    this.cerrarDetalle._elementRef.nativeElement.click()
    
  }

}

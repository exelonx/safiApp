import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalcularTiempoPipe } from './calcular-tiempo.pipe';



@NgModule({
  declarations: [CalcularTiempoPipe],
  imports: [
    CommonModule
  ],
  exports: [
    CalcularTiempoPipe
  ]
})
export class PipesModule { }

import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable, interval, Observer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Pipe({
  name: 'calcularTiempo'
})
export class CalcularTiempoPipe implements PipeTransform {

  transform(fecha: Date) {


    // Diferencia esta en minutos

    return new Observable<string>((observer) => {
      setInterval(() => {
        let fechaActual = dayjs(new Date())
        let fechaAnterior = dayjs(fecha)

        let diferencia = fechaActual.diff(fechaAnterior, 'minute')
        let difMeses = fechaActual.diff(fechaAnterior, 'month')

        let valor: string = "";
        if (diferencia < 1) {

          valor = 'Menos de 1 minuto'

        } else if (diferencia < 60) {

          valor = `Hace ${diferencia} ${diferencia === 1 ? 'minuto' : 'minutos'}`

        } else if (diferencia < 1440) {  // Horas

          let horas = fechaActual.diff(fechaAnterior, 'hour')
          valor = `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`

        } else if (difMeses < 1) {  // Días

          let dias = fechaActual.diff(fechaAnterior, 'day')
          valor = `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`

        } else if (difMeses >= 1) { // Meses

          valor = `Hace ${difMeses} ${difMeses === 1 ? 'mes' : 'meses'}`

        } else {
          valor = 'Error'
        }

        
        observer.next(valor)


      }, 1000)
    })







  }
}

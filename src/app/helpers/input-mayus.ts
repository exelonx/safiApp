import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

export class InputMayus {

    // CÓMO USARLO: 
    // 1. Importar esta clase dentro de su componente
    // 2. Instanciarla en un atributo de su componente para usarlo en la vista HTML. Ejemplo: toMayus = InputMayus.toMayus;

    // Método ESTÁTICO para convertir los inputs de formularios reactivos a mayúsculas
    static toMayus(formulario: FormGroup, formControlName: string) { 
    
        if(formulario.controls[formControlName].value) {

            // Extraser el valor del control del formulario
            const valorFormulario = formulario.controls[formControlName].value
            // Pasarlo a Mayúscula
            formulario.controls[formControlName].setValue(valorFormulario.toUpperCase()) 

        }
    
    }

    static toMayusNoReactivo(elemento: any) {
        console.log(elemento)
    }

}

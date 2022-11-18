import { Municipio } from './municipio.interface';
import { Departamento } from './departamento.interface';
export interface direccionRes{

    departamento: Departamento[],
    municipio?: Municipio[]

}
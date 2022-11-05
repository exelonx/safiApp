export interface PreguntaResp{ /* INavbarData */

   ok?: boolean,
   msg?: string,
   countPregunta?: number, /* Cuantos hay en total */
   limite?: number, /* Límite de items que se mostrarán en la tabla */
   preguntas?: Pregunta[], /* Retorna cada una de las filas que tiene las tablas */

}

export interface Pregunta{

   ID_PREGUNTA: number,
   PREGUNTA: string,
}
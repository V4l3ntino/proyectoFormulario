export interface Person {
    id: number
    nombre: string
    apellido: string
    experiencia: number
}

export interface ExpedienteJson {
    id: string
    trabajador: number
    trabajador_nombre?: string
    sexo: string
    edad: number
    puesto_trabajo: string
    lugar_accidente: string
    fecha_suceso: string
    lesion: string
    lesionado_check: boolean
    descripcion_hechos: string
    valoracion_hechos: string
    formas_accidente: string
    analisis_causas: string
    causas_accidente: string,
    aplicar_accion: string,
    itinere: boolean
}


export interface ImagenJson {
    id?: string
    expediente: string
    imagen_path?: string
    imagen?: File|string
}

export interface selectJson {
    id: number
    nombre: string
}

export interface aplicarAcciones {
    id:number,
    accion: string,
    prioridad: number,
    responsable: string
}
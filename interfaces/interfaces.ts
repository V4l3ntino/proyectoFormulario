export interface Person {
    id: number
    nombre: string
    apellido: string
    experiencia: number
}

export interface ExpedienteJson {
    id: number
    trabajador: number
    trabajador_nombre?: string
    sexo: string
    edad: number
    lugar_accidente: string
    fecha_suceso: string
    lesion: string
    descripcion_hechos: string
}


export interface ImagenJson {
    id?: number
    expediente: number
    imagen_path?: string
    imagen?: File
}
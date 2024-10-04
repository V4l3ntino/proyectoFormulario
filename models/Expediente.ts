export class Expediente {
    private id: number
    private _trabajador: string;
    private _sexo: string;
    private _edad: number;
    private _lugarAccidente: string;
    private _fechaSuceso: string;
    private _lesion: string;
    private _descripcionHechos: string;

    constructor(id: number,trabajador: string, sexo: string, edad: number, lugarAccidente: string, fechaSuceso: string, lesion: string, descripcionHechos: string){
        this.id = id;
        this._trabajador = trabajador;
        this._sexo = sexo;
        this._edad = edad;
        this._lugarAccidente = lugarAccidente;
        this._fechaSuceso = fechaSuceso;
        this._lesion = lesion;
        this._descripcionHechos = descripcionHechos;
        this._descripcionHechos = descripcionHechos;
    }

     
    set trabajador(nombre: string) {
        this._trabajador = nombre;
    }
    get trabajador(): string {
        return this._trabajador;
    }

    
    set sexo(value: string) {
        this._sexo = value;
    }
    get sexo(): string {
        return this._sexo;
    }

    
    set edad(value: number) {
        this._edad = value;
    }
    get edad(): number {
        return this._edad;
    }

    
    set lugarAccidente(value: string) {
        this._lugarAccidente = value;
    }
    get lugarAccidente(): string {
        return this._lugarAccidente;
    }

    
    set fechaSuceso(value: string) {
        this._fechaSuceso = value;
    }
    get fechaSuceso(): string {
        return this._fechaSuceso;
    }

    
    set lesion(value: string) {
        this._lesion = value;
    }
    get lesion(): string {
        return this._lesion;
    }

    
    set descripcionHechos(value: string) {
        this._descripcionHechos = value;
    }
    get descripcionHechos(): string {
        return this._descripcionHechos;
    }


}
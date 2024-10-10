export class Expediente {
    private _trabajador: number;
    private _sexo: string;
    private _edad: number;
    private _lugar_accidente: string;
    private _fecha_suceso: string;
    private _lesion: string;
    private _lesionado_check: boolean;
    private _descripcion_hechos: string;

    constructor(trabajador: number, sexo: string, edad: number, lugarAccidente: string, fechaSuceso: string, lesion: string, descripcionHechos: string, lesionado_check: boolean){
        this._trabajador = trabajador;
        this._sexo = sexo;
        this._edad = edad;
        this._lugar_accidente = lugarAccidente;
        this._fecha_suceso = fechaSuceso;
        this._lesion = lesion;
        this._descripcion_hechos = descripcionHechos;
        this._lesionado_check = lesionado_check;
    }

    toStirng(){
        return `${this.trabajador}, Edad: ${this.edad}, Sexo: ${this.sexo}`
    }

     
    set trabajador(nombre: number) {
        this._trabajador = nombre;
    }
    get trabajador(): number {
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
        this._lugar_accidente = value;
    }
    get lugarAccidente(): string {
        return this._lugar_accidente;
    }

    
    set fechaSuceso(value: string) {
        this._fecha_suceso = value;
    }
    get fechaSuceso(): string {
        return this._fecha_suceso;
    }

    
    set lesion(value: string) {
        this._lesion = value;
    }
    get lesion(): string {
        return this._lesion;
    }

    
    set descripcionHechos(value: string) {
        this._descripcion_hechos = value;
    }
    get descripcionHechos(): string {
        return this._descripcion_hechos;
    }

    set lesionado_check(value: boolean){
        this._lesionado_check = value
    }
    get lesionado_check(): boolean{
        return this._lesionado_check;
    }


}
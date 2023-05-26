export class FilterEntity {
    paginar: boolean;
    loadInit: boolean;
    primera: boolean;
    items: number;
    offset: number;
    total: number;
    pageIndex: number;
    orderCampo: string;
    orderTipo: string;
    
    grupo: string;
    subGrupo: string;
    numero: string;
    familia: string;
    descripcion: string;
    marca: string;
    modelo: string;
    fabricante: string;
    chasis: string;
    motor: string;
    anio: number;
    traccion: string;
    version: string;
    aplicacion: string;

    cliente: string;
    razon_social: string;
    nombre_comercial: string;
    registro: string;
    estado: string;

    constructor(items){
        this.paginar = true;
        this.loadInit = false;
        this.primera = true;
        this.items = items;
        this.offset = 0;
        this.total = 0;
        this.pageIndex = 0;
        //this.orderCampo = campo;
        //this.orderTipo = "asc";

        this.grupo = null;
        this.subGrupo = null;
        this.familia = null;
        this.fabricante = null;
        this.numero = "";
        this.descripcion = "";
        this.marca = "";
        this.modelo = "";
        this.chasis = "";
        this.motor = "";
        this.anio = null;
        this.traccion = "";
        this.version = "";
        this.aplicacion = "";

        this.cliente = "";
        this.razon_social = "";
        this.nombre_comercial = "";
        this.registro = "";
    }
}

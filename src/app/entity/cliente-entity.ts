export class ClienteEntity {
    codigo: string;
    dui: string;
    nrc: string;
    nit: string;
    nombre_social:string;
    nombre_comercial: string;
    correo: string;
    giro: string;
    direccion: string;
    direccion2: string;
    pais: string;
    grupo_pais: string;
    codigo_postal: string;
    ciudad: string;
    telefono: string;
    celular: string;
    contacto: string;
    area_despacho: string;
    tipo_pago: string;
    grupo: string;
    limite: number;
    saldo: number;
    vendedor: string;

    constructor(){
        this.tipo_pago = "";
        this.limite = 0;
        this.saldo = 0;
    }
}

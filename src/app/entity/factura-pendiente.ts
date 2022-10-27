export class FacturaPendienteEntity {
    tipo_documento: string;
    sub_tipo: string;
    tipo_credito: string;
    termino_pago: string;
    codigo_vendedor: string;
    ubicacion: string;
    documento: string;
    numero: number;
    numero_externo: string;
    fecha_registro:Date;
    fecha_vencimiento: Date;
    abierto: number;
    descripcion: string;
    inicial: number;
    saldo: number;
    dias_mora: number;
}

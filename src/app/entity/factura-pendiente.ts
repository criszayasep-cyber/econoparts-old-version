export class FacturaPendienteEntity {
    tipo_documento: number;
    numero: number;
    numero_externo: string;
    documento: string;
    fecha_registro:Date;
    fecha_vencimiento: Date;
    abierto: number;
    descripcion: string;
    saldo: number;
}

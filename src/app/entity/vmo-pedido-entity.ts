import { VmoPedidoDetalleEntityEntity } from "./vmo-pedido-detalle-entity";

export class VmoPedidoEntityEntity {
    ped_id: number;
    ped_fecha_registro: Date;
    ped_usuario: string;
    ped_transferido_nav: number;
    ped_estado: string;
    ped_cliente_correo: string;
    ped_no: string;
    ped_cliente_codigo: string;
    ped_fecha: Date;
    ped_tipo_pago: string;
    ped_location: string;
    ped_dimension: string;
    ped_dimension2: string;
    ped_vendedor: string;
    ped_monto: number;
    ped_monto_iva: number;
    ped_cliente_nombre: string;
    ped_cliente_direccion: string;
    ped_cliente_direccion2: string;
    ped_cliente_dui: string;
    ped_cliente_nit: string;
    ped_cliente_comercial: string; 
    ped_cantidad: number;
    ped_comentario: string;
    ped_telefono: string;
    ped_ruta: string;
    ped_dimension_id: number;
    ped_celular: string;
    vmo_pedido_detalle: Array<VmoPedidoDetalleEntityEntity>;
}

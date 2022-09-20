
export class VmoPedidoDetalleEntityEntity {
    pde_id: number;
    pde_pedido: number;
    pde_linea: number;
    pde_producto: string;
    pde_descripcion: string;
    pde_cantidad: number;
    pde_precio_unitario: number;
    pde_descuento: number;
    pde_monto: number;
    pde_monto_iva: number;
    pde_unidad_medida: string;
    pde_estado: string;
    pde_fecha_creado: Date;
    pde_fecha_eliminado: Date;
}
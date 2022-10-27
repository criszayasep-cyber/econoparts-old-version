
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
    pde_lp_conversion: number;
    pde_lp_aplica_promocion: number;
    pde_lp_promocion: string;
    pde_lp_lista: string;
    pde_lp_descuento: number;
    pde_lp_precio_lista: number;
    pde_lp_precio_lista_final: number;
    pde_precio_unitario_final: number;
}
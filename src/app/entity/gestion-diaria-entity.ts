import { ClienteEntity } from "./cliente-entity";
import { VmoPedidoEntityEntity } from "./vmo-pedido-entity";
import { VmoRutasDetalleEntity } from "./vmo-rutas-detalle-entity";

export class GestionDiariaEntity {
    ruta: VmoRutasDetalleEntity;
    cliente: ClienteEntity;
    pedido: VmoPedidoEntityEntity;
}

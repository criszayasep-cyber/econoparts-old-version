import {ResultadoHttpEntity} from './resultado-http-entity';

export class ResultadoHttpResponse {
    data: ResultadoHttpEntity;
    msj: string = "";
    ok: boolean = true;
    codigo: number = 0;
}

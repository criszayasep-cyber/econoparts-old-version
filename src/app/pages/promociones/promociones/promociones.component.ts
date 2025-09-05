import { Component, Input, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/default/tools.service';
import { PedidoService } from 'src/app/services/pedido.service';

export interface TreeNode {
  id: string;
  descripcionPromo: string;
  offerNo?: string; // <-- AÑADIR ESTA PROPIEDAD
  Checked?: boolean;
  expanded?: boolean;
  level?: number;
  code: string;
  description: string;
  cantidadPromociones: string;
  children?: TreeNode[];
  parent?: TreeNode;
}

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.scss']
})
export class PromocionesComponent implements OnInit {
  @Input() products!: any[];
  // ... tus datos `treeData` aquí ...
  treeData: TreeNode[] = [
    {
            "descripcionPromo": null,
            "offerNo": "031",
            "id": "675130PROM",
            "code": "675130PROM",
            "expanded": false,
            "description": "PROMOCION 6+1 MAYOREO",
            "cantidadPromociones": null,
            "Checked": true,
            "children": [
                {
                    "descripcionPromo": null,
                    "offerNo": "031",
                    "id": "675130PROM",
                    "code": "675130PROM",
                    "description": "PROMOCION 6+1 MAYOREO",
                    "cantidadPromociones": null,
                    "Checked": false
                }
            ]
        }
  ];

  flatTreeData: TreeNode[] = [];

  constructor(
    private readonly pedidoService: PedidoService,
    private tools: ToolsService,
  ) { }

  ngOnInit(): void {
    console.log("Promociones ", this.products);
    this.addPromocion();
    this.treeData.forEach(node => {
      node.Checked = true;
    });

    // Después de establecer el estado inicial, construimos el árbol como siempre.
    this.rebuildFlatTree();
  }

  async addPromocion() {
    const responce = await this.pedidoService.promoUpdate({products: this.products});
    console.log(responce);
    if (responce) {
      if (responce.ok) {
        this.tools.showNotification("Promoción Añadida", responce.mensaje, "Ok");
      } else {
        this.tools.showNotification("Error", responce.error, "Ok");
      }
    }
  }

  /**
   * =================================================================
   * VERSIÓN FINAL DE `toggleCheck` CON PROPAGACIÓN HACIA ARRIBA
   * =================================================================
   */
  toggleCheck(node: TreeNode, event: any) {
    event.stopPropagation();
    const isChecked = event.detail.Checked;

    node.Checked = isChecked;

    if (isChecked) {
      // --- LÓGICA AL MARCAR ---

      // 1. Si es un hijo, desmarca a sus hermanos (selección única)
      if (node.level! > 0) {
        const siblings = this.getSiblings(node);
        for (const sibling of siblings) {
          sibling.Checked = false;
        }
      }

      // 2. <<< NUEVA LÓGICA: Propaga la selección hacia arriba a los padres
      this.updateParentCheckedState(node);

    } else {
      // --- LÓGICA AL DESMARCAR ---

      // 1. Propaga el desmarcado hacia abajo a todos los hijos
      if (this.hasChildren(node)) {
        this.updateChildrenCheckedState(node.children!, false);
      }
    }
  }

  /**
   * NUEVA FUNCIÓN: Sube por el árbol marcando a todos los padres.
   * Se detiene cuando llega a un nodo sin padre (la raíz).
   */
  private updateParentCheckedState(node: TreeNode) {
    if (node.parent) {
      node.parent.Checked = true;
      // Llamada recursiva para seguir subiendo por el árbol
      this.updateParentCheckedState(node.parent);
    }
  }

  private updateChildrenCheckedState(nodes: TreeNode[], Checked: boolean) {
    for (const child of nodes) {
      child.Checked = Checked;
      if (this.hasChildren(child)) {
        this.updateChildrenCheckedState(child.children!, Checked);
      }
    }
  }

  // --- El resto de las funciones auxiliares no cambian ---

  rebuildFlatTree() {
    this.flatTreeData = [];
    this.flattenTree(this.treeData, 0, undefined);
  }

  private flattenTree(nodes: TreeNode[], level: number, parent: TreeNode | undefined) {
    for (const node of nodes) {
      node.level = level;
      node.parent = parent;
      this.flatTreeData.push(node);

      if (node.expanded && node.children) {
        this.flattenTree(node.children, level + 1, node);
      }
    }
  }

  toggleNode(node: TreeNode) {
    if (this.hasChildren(node)) {
      node.expanded = !node.expanded;
      this.rebuildFlatTree();
    }
  }

  private getSiblings(node: TreeNode): TreeNode[] {
    if (!node.parent) {
      return this.treeData.filter(rootNode => rootNode.id !== node.id);
    }
    return node.parent.children!.filter(child => child.id !== node.id);
  }

  getPadding(level: number): string {
    return `${level * 25}px`;
  }

  hasChildren(node: TreeNode): boolean {
    return !!(node.children && node.children.length > 0);
  }

  // ... dentro de la clase TreeChecklistComponent

  /**
   * Recorre todo el árbol de datos y devuelve un array plano
   * con todos los nodos que están marcados (Checked: true).
   */
  /**
   * DEVUELVE UNA ESTRUCTURA DE ÁRBOL FILTRADA CON SOLO LOS NODOS SELECCIONADOS.
   * Esta función es segura y no modifica los datos originales.
   */
  public getSelectedValues(): TreeNode[] {

    /**
     * Esta función auxiliar recursiva es la que hace el trabajo.
     * Recibe una lista de nodos y devuelve una NUEVA lista que contiene
     * solo los nodos seleccionados y sus descendientes seleccionados.
     */
    function filterCheckedNodes(nodes: TreeNode[]): TreeNode[] {

      // Usamos .reduce() para construir el nuevo array filtrado
      return nodes.reduce((accumulator, node) => {

        // 1. Si el nodo actual está seleccionado...
        if (node.Checked) {

          // 2. Creamos una COPIA del nodo para no modificar el original.
          const newNode: TreeNode = { ...node };

          // 3. Si tiene hijos, llamamos recursivamente a esta misma función
          //    para filtrar también a los hijos.
          if (node.children && node.children.length > 0) {
            newNode.children = filterCheckedNodes(node.children);
          }

          // 4. Añadimos el nuevo nodo (con sus hijos ya filtrados) al resultado.
          accumulator.push(newNode);
        }

        return accumulator;
      }, [] as TreeNode[]);
    }

    // Iniciamos el proceso de filtrado desde la raíz de nuestros datos
    return filterCheckedNodes(this.treeData);
  }

  // ... dentro de la clase TreeChecklistComponent

  onSaveSelection() {
    this.getSelectedValues();

    console.log("--- Nodos Seleccionados ---");
    console.log({"promotions": this.getSelectedValues()});

    /* Opcional: Si solo quieres los nombres o los IDs
    const selectedNames = selected.map(node => node.name);
    console.log("Nombres:", selectedNames);

    const selectedIds = selected.map(node => node.id);
    console.log("IDs:", selectedIds);
*/
    // Aquí es donde enviarías los datos a un servicio, a una API, etc.
    // ej: this.myApiService.savePreferences(selectedIds);
  }

}

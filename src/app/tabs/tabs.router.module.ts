import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService as AuthGuard } from '../services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab3/detalle',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/cliente-detalle/cliente-detalle.module').then(m => m.ClienteDetallePageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab3/notas-credito-relacionadas',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/notas-credito-relacionadas/notas-credito-relacionadas.module').then(m => m.NotasCreditoRelacionadasPageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab3/facturas-pendientes-detalle',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/factura-pendiente-detalle/factura-pendiente-detalle.module').then(m => m.FacturaPendienteDetallePageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../tab4/tab4.module').then(m => m.Tab4PageModule),
            canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab4/detalle-pedido',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/pedido-detalle/pedido-detalle.module').then(m => m.PedidoDetallePageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab4/detalle-cotizacion',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/cotizacion-detalle/cotizacion-detalle.module').then(m => m.CotizacionDetallePageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: 'tab4/detalle-historico',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/historico-detalle/historico-detalle.module').then(m => m.HistoricoDetallePageModule),
              canActivate: [AuthGuard] 
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

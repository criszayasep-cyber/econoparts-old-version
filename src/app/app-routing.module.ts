import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardNoneService as AuthGuardNone } from './services/auth/auth-guard-none.service';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './services/auth/role-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuardNone]
  },
  { 
    path: 'tab3', 
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tab4', 
    loadChildren: () => import('./tab4/tab4.module').then(m => m.Tab4PageModule),
    canActivate: [AuthGuard] 
  },  {
    path: 'historico-detalle',
    loadChildren: () => import('./pages/historico-detalle/historico-detalle.module').then( m => m.HistoricoDetallePageModule)
  },
  {
    path: 'notas-credito-relacionadas',
    loadChildren: () => import('./pages/notas-credito-relacionadas/notas-credito-relacionadas.module').then( m => m.NotasCreditoRelacionadasPageModule)
  },
  {
    path: 'factura-pendiente-detalle',
    loadChildren: () => import('./pages/factura-pendiente-detalle/factura-pendiente-detalle.module').then( m => m.FacturaPendienteDetallePageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  },
  {
    path: 'estatus-conexion',
    loadChildren: () => import('./pages/estatus-conexion/estatus-conexion.module').then( m => m.EstatusConexionPageModule)
  },
  {
    path: 'venta-perdida',
    loadChildren: () => import('./pages/venta-perdida/venta-perdida.module').then( m => m.VentaPerdidaPageModule)
  },



];
@NgModule({ 
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

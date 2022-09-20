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
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuardNone]
  },
  { 
    path: 'tab3', 
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tab3/detalle', 
    loadChildren: () => import('./cliente-detalle/cliente-detalle.module').then(m => m.ClienteDetallePageModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tab4', 
    loadChildren: () => import('./tab4/tab4.module').then(m => m.Tab4PageModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tab4/mi-cuenta', 
    loadChildren: () => import('./mi-cuenta/mi-cuenta.module').then(m => m.MiCuentaPageModule),
    canActivate: [AuthGuard] 
  }
];
@NgModule({ 
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

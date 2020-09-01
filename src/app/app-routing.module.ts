import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

import { AuthGuard } from '@app/guard/auth.guard';
import { NoAuthGuard } from '@app/guard/no-auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
    import('@modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'landpage',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('@modules/land-page/land-page.module').then(m => m.LandPageModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: ContentLayoutComponent,
    children: [

      {
        path: 'historics',
        data: {
          breadcrumb: 'Históricos'
        },
        loadChildren: () => import('@modules/historic/historic-list.module').then(m => m.HistoricListModule)
      },
      {
        path: 'workflow',
        data: {
          breadcrumb: 'Fluxo de Planilhas'
        },
        loadChildren: () => import('@modules/workflow/workflow.module').then(m => m.WorkflowModule)
      },
      {
        path: 'rules',
        data: {
          breadcrumb: 'Regras'
        },
        loadChildren: () => import('@modules/rule-list/rule-list.module').then(m => m.RuleListModule)
      },
      {
        path: 'entrys',
        data: {
          breadcrumb: 'Última Digitação'
        },
        loadChildren: () => import('@modules/transacoes/transaction.module').then(m => m.TransactionModule)
      },
      {
        path: '',
        redirectTo: 'entrys',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'entrys',
        pathMatch: 'full'
      }

    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

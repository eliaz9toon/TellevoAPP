import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./pages/splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reset-contra',
    loadChildren: () => import('./pages/reset-contra/reset-contra.module').then( m => m.ResetContraPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home-conductor',
    loadChildren: () => import('./pages/home-conductor/home-conductor.module').then( m => m.HomeConductorPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'invitado-dashboard',
    loadChildren: () => import('./pages/invitado/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'usuario-dashboard',
    loadChildren: () => import('./pages/usuario/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'conductor-dashboard',
    loadChildren: () => import('./pages/conductor/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'reporte',
    loadChildren: () => import('./pages/reporte/reporte.module').then( m => m.ReportePageModule)
  },
  {
    path: 'formulario-conductor',
    loadChildren: () => import('./pages/formulario-conductor/formulario-conductor.module').then( m => m.FormularioConductorPageModule)
  },
  {
    path: 'perfil-usuario',
    loadChildren: () => import('./pages/perfil-usuario/perfil-usuario.module').then( m => m.PerfilUsuarioPageModule)
  },
  {
    path: 'perfil-conductor',
    loadChildren: () => import('./pages/perfil-conductor/perfil-conductor.module').then( m => m.PerfilConductorPageModule)
  },
  {
    path: 'perfil-admin',
    loadChildren: () => import('./pages/perfil-admin/perfil-admin.module').then( m => m.PerfilAdminPageModule)
  },
  {
    path: 'confirmar-formulario',
    loadChildren: () => import('./pages/confirmar-formulario/confirmar-formulario.module').then( m => m.ConfirmarFormularioPageModule)
  },
  {
    path: 'edit-user/:uid',
    loadChildren: () => import('./pages/edit-user/edit-user.module').then( m => m.EditUserPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'profile/:uid',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'trip-details/:id',
    loadChildren: () => import('./pages/trip-details/trip-details.module').then( m => m.TripDetailsPageModule)
  },
  {
    path: 'ver-mapa',
    loadChildren: () => import('./pages/ver-mapa/ver-mapa.module').then( m => m.VerMapaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

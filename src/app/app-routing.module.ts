import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ZonesComponent } from './zones/zones.component';
import { LoginGuard } from './LoginGuard';
import { DetailsComponent } from './details/details.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'zones', component: ZonesComponent, canActivate: [LoginGuard] },
  { path: 'details', component: DetailsComponent, canActivate: [LoginGuard] },
  { path: 'schedule', component: ScheduleComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
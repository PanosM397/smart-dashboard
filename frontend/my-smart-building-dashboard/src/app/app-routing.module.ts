import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FloorPlanComponent } from './floor-plan/floor-plan.component';
import { SystemControlsComponent } from './system-controls/system-controls.component';
import { SolarOverviewComponent } from './solar-overview/solar-overview.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'plan', component: FloorPlanComponent },
  { path: 'solar', component: SolarOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

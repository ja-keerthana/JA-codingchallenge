// modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// page components
import * as pages from './pages';

export const routes: Routes = [
  { path: 'jobs', component: pages.JobsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
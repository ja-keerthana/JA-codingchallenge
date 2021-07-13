// modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// page components
import * as pages from './pages';

export const routes: Routes = [
  { path: 'candidates', component: pages.CandidatesPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class CandidatesRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobsRoutingModule } from './jobs/jobs-routing.module';
import { CandidatesRoutingModule } from './candidates/candidates-routing.module';

@NgModule({
  imports: [
    JobsRoutingModule,
    CandidatesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

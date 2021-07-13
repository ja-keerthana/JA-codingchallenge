import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobsPageComponent {
  selectedJobId: number | undefined;

  constructor() { }

  public selectJob(jobId: number) {
    this.selectedJobId = jobId;
  }

}

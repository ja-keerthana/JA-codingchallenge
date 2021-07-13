import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { take, withLatestFrom } from 'rxjs/operators';
import { JobService } from '../../services/job.service';
import { Job } from '../../models';
import { CandidateSummary } from '../../../candidates/models';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobDetailComponent implements OnChanges {
  @Input() public selectedJobId: number | undefined;
  public job: Job | undefined | null;
  public candidateSummaries: CandidateSummary[] | undefined | null;

  constructor(private _cdRef: ChangeDetectorRef, private _jobService: JobService) { }

  ngOnChanges(changes: SimpleChanges){
    const jobId: number | undefined = (changes?.selectedJobId?.currentValue) as number;
    if (jobId) {
      this.getJob((jobId as any as number));
    }
  }

  public getJob(jobId: number): void {
    this._jobService
      .getJob(jobId)
      .pipe(
        withLatestFrom(this._jobService.matchJobToCandidates(jobId)),
        take(1)
      )
      .subscribe(([job, candidateSummaries]: [Job | null, CandidateSummary[] | null]) => {
        this._cdRef.markForCheck();
      });
  }
}

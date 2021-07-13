import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { take, withLatestFrom } from 'rxjs/operators';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models';
import { JobSummary } from '../../../jobs/models';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateDetailComponent implements OnChanges {
  @Input() public selectedCandidateId: number | undefined;
  public candidate: Candidate | undefined | null;
  public jobSummaries: JobSummary[] | undefined | null;

  constructor(private _cdRef: ChangeDetectorRef, private _candidateService: CandidateService) { }

  ngOnChanges(changes: SimpleChanges){
    const candidateId: number | undefined = (changes?.selectedCandidateId?.currentValue) as number;
    if (candidateId) {
      this.getCandidate((candidateId as any as number));
    }
  }

  public getCandidate(candidateId: number): void {
    this._candidateService
      .matchCandidateToJobs(candidateId)
      .pipe(
        withLatestFrom(this._candidateService.getCandidate(candidateId)),
        take(1)
      )
      .subscribe(([jobSummaries,candidate]: [JobSummary[] | null,Candidate | null]) => {
        this.candidate = candidate;
        this.jobSummaries = jobSummaries
        this._cdRef.markForCheck();
      });
  }
}

import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-candidates-page',
  templateUrl: './candidates-page.component.html',
  styleUrls: ['./candidates-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatesPageComponent {
  selectedCandidateId: number | undefined;

  constructor() { }

  public selectCandidate(candidateId: number) {
    this.selectedCandidateId = candidateId;
  }

}

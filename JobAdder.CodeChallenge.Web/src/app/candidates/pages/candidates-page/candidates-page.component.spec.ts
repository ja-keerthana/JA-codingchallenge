import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { RouterOutlet } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CandidatesPageComponent } from './candidates-page.component';
import { CandidateSummaryTableComponent, CandidateDetailComponent } from '../../components';

describe('CandidatesPageComponent', () => {
  let spectator: Spectator<CandidatesPageComponent>

  const createComponent = createComponentFactory({
    component: CandidatesPageComponent,
    declarations: [ MockComponent(CandidateSummaryTableComponent), MockComponent(CandidateDetailComponent), RouterOutlet ],
    imports: [ MatDividerModule, MatIconModule ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the candidates page component', () => {
    expect(spectator).toBeTruthy();
  });

  it('should not have a selected candidateId on page load', () => {
    const result: number | undefined = spectator.component.selectedCandidateId;
    expect(result).toBeUndefined();
  });

  it('should be able to select a candidateId', () => {
    // arrange
    const newCandidateId: number = 42;

    // act
    spectator.component.selectCandidate(newCandidateId);

    // assert
    const result: number | undefined = spectator.component.selectedCandidateId;
    expect(result).toBe(newCandidateId);
  });

  it('should update candidateId when CandidateSummaryTableComponent emits a selectCandidate event', () => {
    // arrange
    const expectedInput: number = 42;
    spectator.component.selectedCandidateId = 11;

    // act
    spectator.query(CandidateSummaryTableComponent)?.selectCandidate.emit(expectedInput);
    spectator.detectChanges();

    // assert
    expect(spectator.component.selectedCandidateId).toBe(expectedInput);
  });
});

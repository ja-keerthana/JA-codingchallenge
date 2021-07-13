import { CandidateDetailComponent } from './candidate-detail.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockService } from 'ng-mocks';
import { ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CandidateService } from '../../services/candidate.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { Candidate } from '../../models';
import { JobSummary } from '../../../jobs/models';

describe('CandidateDetailComponent', () => {
  let spectator: Spectator<CandidateDetailComponent>;

  // set mock service global defaults
  // no function overrides required
  const cdRefMock = MockService(ChangeDetectorRef);
  const candidateServiceMock = MockService(CandidateService);

  const createComponent = createComponentFactory({
    component: CandidateDetailComponent,
    imports: [ MatDividerModule,
      MatListModule,
      MatCardModule,
      MatIconModule
    ],
    
    providers: [
      { provide: CandidateService, useValue: candidateServiceMock },
      { provide: ChangeDetectorRef, useValue: cdRefMock }
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('on component initialisation', () => {
    it('should create the candidates detail component', () => {
      expect(spectator).toBeTruthy();
      expect(spectator.component.selectedCandidateId).toBeUndefined();
      expect(spectator.component.candidate).toBeUndefined();
      expect(spectator.component.jobSummaries).toBeUndefined();
    });
  });

  describe('on every subsequent component ngOnChanges detection cycle', () => {
    it('should get candidate when selectedCandidateId changes and is a valid number', () => {
      // arrange
      // override component function
      spyOn(spectator.component, 'getCandidate').and.callFake;
      const expectedValue: number = 42;

      // act
      spectator.component.ngOnChanges(<SimpleChanges>{
        selectedCandidateId: { 
          previousValue: spectator.component.selectedCandidateId,
          currentValue: expectedValue,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // assert
      expect(spectator.component.getCandidate).toHaveBeenCalled();
    });

    it('should get candidate when selectedCandidateId changes and is a valid number', () => {
      // arrange
      // override component function
      spyOn(spectator.component, 'getCandidate').and.callFake;
      const expectedValue: number | undefined = undefined;

      // act
      spectator.component.ngOnChanges(<SimpleChanges>{
        selectedCandidateId: { 
          previousValue: spectator.component.selectedCandidateId,
          currentValue: expectedValue,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // assert
      expect(spectator.component.getCandidate).not.toHaveBeenCalled();
    });
  });

  describe('on getCandidate', () => {
    it('should update properties to be null when candidate is null and matching candidates return null results', () => {
      // arrange
      const candidateServiceInstance: CandidateService = (spectator.component as any)._candidateService;
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;

      const expectedCandidate: Candidate | null = null;
      const expectedJobSummaryMatches: JobSummary[] | null = null;

      spyOn(candidateServiceInstance, 'getCandidate').and.returnValue(of(expectedCandidate));
      spyOn(candidateServiceInstance, 'matchCandidateToJobs').and.returnValue(of(expectedJobSummaryMatches));
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck').and.callFake(() => {});

      // act
      spectator.component.getCandidate(42);
      spectator.detectComponentChanges();

      // assert
      expect(spectator.component.candidate).toBeNull();
      expect(spectator.component.jobSummaries).toBeNull();
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should update properties to the expected when candidate and matching candidates results exist', () => {
      // arrange
      const candidateServiceInstance: CandidateService = (spectator.component as any)._candidateService;
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;

      const expectedCandidate: Candidate | null = <Candidate>{
        candidateId: 42, name: 'Can Did Ate', skillTags: [ 'skill 1', 'skill 2' ]
      };
      const expectedJobSummaryMatches: JobSummary[] | null = [
        <JobSummary>{ jobId: 55, name: '.NET Engineer' },
        <JobSummary>{ jobId: 56, name: 'Product Des1gn3r' },
      ];

      spyOn(candidateServiceInstance, 'getCandidate').and.returnValue(of(expectedCandidate));
      spyOn(candidateServiceInstance, 'matchCandidateToJobs').and.returnValue(of(expectedJobSummaryMatches));
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck').and.callFake(() => {});

      // act
      spectator.component.getCandidate(42);
      spectator.detectComponentChanges();

      // assert
      expect(spectator.component.candidate).toBe(expectedCandidate);
      expect(spectator.component.jobSummaries).toBe(expectedJobSummaryMatches);
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  describe('on the template binding', () => {
    it('should show no candidate template when candidate data has not loaded', () => {
      // arrange
      const expectedCandidate: Candidate | null = null;
      spectator.component.candidate = expectedCandidate;

      // act
      spectator.detectComponentChanges();

      // assert
      expect(spectator.query('mat-card')).not.toExist();
      expect(spectator.query('.animate-bounce')).toExist();
    });

    it('should show candidate list when candidate exists in the component', () => {
      // arrange
      const expectedCandidate: Candidate = <Candidate>{
        candidateId: 11, name: 'Can Did Ate', skillTags: [ 'skill 42', 'skill 24' ]
      };
      spectator.component.candidate = expectedCandidate;

      // act
      spectator.detectComponentChanges();

      // assert
      expect(spectator.query('mat-card')).toExist();
      expect(spectator.query('.animate-bounce')).not.toExist();
    });
  });
});

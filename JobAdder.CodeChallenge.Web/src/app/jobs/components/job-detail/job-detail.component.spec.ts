import { JobDetailComponent } from './job-detail.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockService } from 'ng-mocks';
import { ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { JobService } from '../../services/job.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { Job } from '../../models';
import { CandidateSummary } from '../../../candidates/models';

describe('JobDetailComponent', () => {
  let spectator: Spectator<JobDetailComponent>;

  // set mock service global defaults
  // no function overrides required
  const cdRefMock = MockService(ChangeDetectorRef);
  const jobServiceMock = MockService(JobService);

  const createComponent = createComponentFactory({
    component: JobDetailComponent,
    imports: [ MatDividerModule,
      MatListModule,
      MatCardModule,
      MatIconModule
    ],
    
    providers: [
      { provide: JobService, useValue: jobServiceMock },
      { provide: ChangeDetectorRef, useValue: cdRefMock }
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('on component initialisation', () => {
    it('should create the jobs detail component', () => {
      expect(spectator).toBeTruthy();
      expect(spectator.component.selectedJobId).toBeUndefined();
      expect(spectator.component.job).toBeUndefined();
      expect(spectator.component.candidateSummaries).toBeUndefined();
    });
  });

  describe('on every subsequent component ngOnChanges detection cycle', () => {
    it('should get job when selectedJobId changes and is a valid number', () => {
      // arrange
      // override component function
      spyOn(spectator.component, 'getJob').and.callFake;
      const expectedValue: number = 42;

      // act
      spectator.component.ngOnChanges(<SimpleChanges>{
        selectedJobId: { 
          previousValue: spectator.component.selectedJobId,
          currentValue: expectedValue,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // assert
      expect(spectator.component.getJob).toHaveBeenCalled();
    });

    it('should get job when selectedJobId changes and is a valid number', () => {
      // arrange
      // override component function
      spyOn(spectator.component, 'getJob').and.callFake;
      const expectedValue: number | undefined = undefined;

      // act
      spectator.component.ngOnChanges(<SimpleChanges>{
        selectedJobId: { 
          previousValue: spectator.component.selectedJobId,
          currentValue: expectedValue,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // assert
      expect(spectator.component.getJob).not.toHaveBeenCalled();
    });
  });

  describe('on getJob', () => {
    it('should update properties to be null when job is null and matching jobs return null results', () => {
      // arrange
      const jobServiceInstance: JobService = (spectator.component as any)._jobService;
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;

      const expectedJob: Job | null = null;
      const expectedCandidateSummaryMatches: CandidateSummary[] | null = null;

      spyOn(jobServiceInstance, 'getJob').and.returnValue(of(expectedJob));
      spyOn(jobServiceInstance, 'matchJobToCandidates').and.returnValue(of(expectedCandidateSummaryMatches));
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck').and.callFake(() => {});

      // act
      spectator.component.getJob(42);
      spectator.detectComponentChanges();

      // assert
      expect(spectator.component.job).toBeNull();
      expect(spectator.component.candidateSummaries).toBeNull();
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should update properties to the expected when job and matching jobs results exist', () => {
      // arrange
      const jobServiceInstance: JobService = (spectator.component as any)._jobService;
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;

      const expectedJob: Job | null = <Job>{
        jobId: 42, name: 'Can Did Ate', skills: [ 'skill 1', 'skill 2' ]
      };
      const expectedCandidateSummaryMatches: CandidateSummary[] | null = [
        <CandidateSummary>{ candidateId: 55, name: '.NET Engineer' },
        <CandidateSummary>{ candidateId: 56, name: 'Product Des1gn3r' },
      ];

      spyOn(jobServiceInstance, 'getJob').and.returnValue(of(expectedJob));
      spyOn(jobServiceInstance, 'matchJobToCandidates').and.returnValue(of(expectedCandidateSummaryMatches));
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck').and.callFake(() => {});

      // act
      spectator.component.getJob(42);
      spectator.detectComponentChanges();

      // assert
      expect(spectator.component.job).toBe(expectedJob);
      expect(spectator.component.candidateSummaries).toBe(expectedCandidateSummaryMatches);
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  describe('on the template binding', () => {
    it('should show no job template when job data has not loaded', () => {
      // arrange
      const expectedJob: Job | null = null;
      spectator.component.job = expectedJob;

      // act
      spectator.detectComponentChanges();

      // assert
      expect(spectator.query('mat-card')).not.toExist();
      expect(spectator.query('.animate-bounce')).toExist();
    });

    it('should show job list when job exists in the component', () => {
      // arrange
      const expectedJob: Job = <Job>{
        jobId: 11, name: 'Can Did Ate', skills: [ 'skill 42', 'skill 24' ]
      };
      spectator.component.job = expectedJob;

      // act
      spectator.detectComponentChanges();

      // assert
      expect(spectator.query('mat-card')).toExist();
      expect(spectator.query('.animate-bounce')).not.toExist();
    });
  });
});

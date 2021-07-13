import { Spectator, createComponentFactory} from '@ngneat/spectator';
import { JobSummaryTableComponent } from './job-summary-table.component';
import { MockService } from 'ng-mocks';
import { ChangeDetectorRef } from '@angular/core';
import { JobService } from '../../services/job.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of, Observable } from 'rxjs';
import { JobSummary } from '../../models';
import { PagedList } from '../../../shared/models';

describe('JobSummaryTableComponent', () => {
  let spectator: Spectator<JobSummaryTableComponent>;

  // set mock service global defaults
  // override using spies to configure per-test
  const cdRefMock = MockService(ChangeDetectorRef, <Partial<ChangeDetectorRef>>{
    markForCheck: (): void => {}
  });
  const jobServiceMock = MockService(JobService,<Partial<JobService>>{
    findJobs: (): Observable<PagedList<JobSummary>> | null => of(<PagedList<JobSummary>>{})
  });

  const createComponent = createComponentFactory({
    component: JobSummaryTableComponent,
    imports: [ MatPaginatorModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule ],
    providers: [
      { provide: JobService, useValue: jobServiceMock },
      { provide: ChangeDetectorRef, useValue: cdRefMock }
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('on component initialisation', () => {
    it('should create the jobs summary table component', () => {
      expect(spectator).toBeTruthy();
      expect(spectator.component.jobs).toBeUndefined();
      expect(spectator.component.currentId).toBeUndefined();
      expect(spectator.component.displayedColumns).toEqual(['jobId', 'name']);
      expect(spectator.component.dataSource).toBeNull();
      expect(spectator.component.totalPaginatedItems).toBe(0);
      expect(spectator.component.pageIndex).toBe(0);
      expect(spectator.component.pageSize).toBe(0);
    });
  
    it('should find jobs during component initialisation', () => {
      // arrange
      // override default component function
      spyOn(spectator.component, 'findJobs').and.callFake(() => {});
  
      // act
      spectator.component.ngOnInit();
  
      // assert
      expect(spectator.component.findJobs).toHaveBeenCalled();
    });
  });

  describe('on isActiveClickRow', () => {
    it('should return false when the jobSummary is null', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      // act
      const result: boolean = spectator.component.isActiveClickRow(null);
  
      // assert
      expect(result).toBeFalse();
    });

    it('should return false when the jobSummary is undefined', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      // act
      const result: boolean = spectator.component.isActiveClickRow(undefined);
  
      // assert
      expect(result).toBeFalse();
    });

    it('should return false when the currentId does not match the jobSummary', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const newCurrentId: number = 11;
      const jobSummary: JobSummary = <JobSummary>{ jobId: newCurrentId, name: 'New Cand' }

      // act
      const result: boolean = spectator.component.isActiveClickRow(jobSummary);
  
      // assert
      expect(result).toBeFalse();
    });

    it('should return true when the currentId matches the jobSummary', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const newCurrentId: number = 42;
      const jobSummary: JobSummary = <JobSummary>{ jobId: newCurrentId, name: 'New Cand' }

      // act
      const result: boolean = spectator.component.isActiveClickRow(jobSummary);
  
      // assert
      expect(result).toBeTrue();
    });
  });

  describe('on onClickRow', () => {
    it('should not select a job when jobSummary is null', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const jobSummary: JobSummary | undefined | null = null;
      spyOn(spectator.component.selectJob, 'emit');
      const cdRefSpy = spyOn((spectator.component as any)._cdRef, 'markForCheck');

      // act
      spectator.component.onClickRow(jobSummary);
  
      // assert
      expect(spectator.component.currentId).toBeUndefined();
      expect(spectator.component.selectJob.emit).toHaveBeenCalledOnceWith(undefined);
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should not select a job when jobSummary is undefined', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const jobSummary: JobSummary | undefined | null = undefined;
      spyOn(spectator.component.selectJob, 'emit');
      const cdRefSpy = spyOn((spectator.component as any)._cdRef, 'markForCheck');

      // act
      spectator.component.onClickRow(jobSummary);
  
      // assert
      expect(spectator.component.currentId).toBeUndefined();
      expect(spectator.component.selectJob.emit).toHaveBeenCalledOnceWith(undefined);
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should select a job when jobSummary is passed through', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;
      const newId: number = 11;

      const jobSummary: JobSummary | undefined | null = <JobSummary>{ jobId: newId, name: 'newname' };
      spyOn(spectator.component.selectJob, 'emit');
      const cdRefSpy = spyOn((spectator.component as any)._cdRef, 'markForCheck')

      // act
      spectator.component.onClickRow(jobSummary);
  
      // assert
      expect(spectator.component.currentId).toBe(newId);
      expect(spectator.component.selectJob.emit).toHaveBeenCalledOnceWith(newId);
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  it('should find jobs during pageChangeEvent', () => {
    // arrange
    const $event: any = { pageIndex: 0, pageSize: 10 };
    spyOn(spectator.component, 'findJobs');

    // act
    spectator.component.pageChangeEvent($event);

    // assert
    expect(spectator.component.findJobs).toHaveBeenCalledOnceWith(0, 10);
  });

  describe('on findJobs with no paginted job results', () => {
    it('should not do anything when finding jobs returns null', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const jobServiceInstance: JobService = (spectator.component as any)._jobService;

      spyOn(jobServiceInstance, 'findJobs').and.callFake(() => of(null));
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');

      spectator.component.paginator = new MatPaginator(new MatPaginatorIntl(), cdRefInstance);
      spectator.component.dataSource = null;
      
      // act
      spectator.detectComponentChanges();
      spectator.component.findJobs(0, 10);

      // assert
      expect(spectator.component.jobs).toBeUndefined;
      expect(spectator.component.dataSource).toBeNull();
      expect(cdRefSpy).not.toHaveBeenCalled();
    });

    it('should gracefully handle empty paginated jobs being returned from the jobService', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');
      spectator.component.paginator = null;
      spectator.component.dataSource = null;
      
      // act
      spectator.detectComponentChanges();
      spectator.component.findJobs(0, 10);

      // assert
      expect(spectator.component.jobs).toBeUndefined();
      expect(spectator.component.dataSource).toBeNull();
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  describe('on findJobs with job results', () => {
    const paginatedJobs: PagedList<JobSummary> | null = <PagedList<JobSummary>>{
      pageSize: 10,
      pageIndex: 0,
      items: [
        <JobSummary>{ jobId: 11, name: 'Jon' },
        <JobSummary>{ jobId: 42, name: 'Jon2' },
        <JobSummary>{ jobId: 43, name: 'Jon3' },
      ],
      totalItems: 3
    };

    it('should handle many jobs being returned from the jobService when called for the first time', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const jobServiceInstance: JobService = (spectator.component as any)._jobService;

      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');
      spyOn(jobServiceInstance, 'findJobs').and.callFake(() => of(paginatedJobs));
      
      // act
      spectator.component.findJobs(0, 10);

      // assert
      expect(spectator.component.jobs).toEqual(paginatedJobs.items);
      expect(spectator.component.dataSource).not.toBeNull();
      expect(spectator.component.dataSource?.paginator).not.toBeNull();
      expect(spectator.component.totalPaginatedItems).toBe(paginatedJobs.items.length);
      expect(spectator.component.pageIndex).toBe(paginatedJobs.pageIndex);
      expect(spectator.component.pageSize).toBe(paginatedJobs.pageSize);
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should handle many jobs being returned from the jobService when called after the first time', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const jobServiceInstance: JobService = (spectator.component as any)._jobService;

      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');
      spyOn(jobServiceInstance, 'findJobs').and.callFake(() => of(paginatedJobs));

      const dataSource: MatTableDataSource<JobSummary> = new MatTableDataSource<JobSummary>(paginatedJobs.items);
      const paginator: MatPaginator | null = new MatPaginator(new MatPaginatorIntl(), cdRefInstance);

      spectator.component.paginator = paginator;
      spectator.component.dataSource = dataSource;
      spectator.component.dataSource.paginator = paginator;
      
      // act
      spectator.component.findJobs(0, 10);

      // assert
      expect(spectator.component.jobs).toEqual(paginatedJobs.items);
      expect(spectator.component.dataSource).toBe(dataSource);
      expect(spectator.component.dataSource?.paginator).toBe(paginator);
      expect(spectator.component.totalPaginatedItems).toBe(paginatedJobs.items.length);
      expect(spectator.component.pageIndex).toBe(paginatedJobs.pageIndex);
      expect(spectator.component.pageSize).toBe(paginatedJobs.pageSize);
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  describe('on checking template binding after a change detection cycle', () => {
    it('should show the job information template if dataSource exists', () => {
      // arrange
      const jobs: JobSummary[] = [<JobSummary>{ jobId: 11, name: 'Only Job' }];
      spectator.component.dataSource = new MatTableDataSource<JobSummary>(jobs);

      // act
      spectator.detectComponentChanges();

      // assert
      expect(spectator.query('table')).toExist();
      expect(spectator.query('td.mat-column-jobId')).toHaveText(jobs[0].jobId.toString());
      expect(spectator.query('td.mat-column-name')).toHaveText(jobs[0].name); 
      expect(spectator.query('.mat-spinner')).not.toExist();
    });

    it('should show the loading template if dataSource does not exist', () => {
      // arrange
      spectator.component.dataSource = null;

      // act
      spectator.detectComponentChanges();

      // assert
      expect(spectator.query('table')).not.toExist();
      expect(spectator.query('mat-spinner')).toExist();
    });
  });
});

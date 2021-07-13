import { Spectator, createComponentFactory} from '@ngneat/spectator';
import { CandidateSummaryTableComponent } from './candidate-summary-table.component';
import { MockService } from 'ng-mocks';
import { ChangeDetectorRef } from '@angular/core';
import { CandidateService } from '../../services/candidate.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of, Observable } from 'rxjs';
import { CandidateSummary } from '../../models';
import { PagedList } from '../../../shared/models';

describe('CandidateSummaryTableComponent', () => {
  let spectator: Spectator<CandidateSummaryTableComponent>;

  // set mock service global defaults
  // override using spies to configure per-test
  const cdRefMock = MockService(ChangeDetectorRef, <Partial<ChangeDetectorRef>>{
    markForCheck: (): void => {}
  });
  const candidateServiceMock = MockService(CandidateService,<Partial<CandidateService>>{
    findCandidates: (): Observable<PagedList<CandidateSummary>> | null => of(<PagedList<CandidateSummary>>{})
  });

  const createComponent = createComponentFactory({
    component: CandidateSummaryTableComponent,
    imports: [ MatPaginatorModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule ],
    providers: [
      { provide: CandidateService, useValue: candidateServiceMock },
      { provide: ChangeDetectorRef, useValue: cdRefMock }
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('on component initialisation', () => {
    it('should create the candidates summary table component', () => {
      expect(spectator).toBeTruthy();
      expect(spectator.component.candidates).toBeUndefined();
      expect(spectator.component.currentId).toBeUndefined();
      expect(spectator.component.displayedColumns).toEqual(['candidateId', 'name']);
      expect(spectator.component.dataSource).toBeNull();
      expect(spectator.component.totalPaginatedItems).toBe(0);
      expect(spectator.component.pageIndex).toBe(0);
      expect(spectator.component.pageSize).toBe(0);
    });
  
    it('should find candidates during component initialisation', () => {
      // arrange
      // override default component function
      spyOn(spectator.component, 'findCandidates').and.callFake(() => {});
  
      // act
      spectator.component.ngOnInit();
  
      // assert
      expect(spectator.component.findCandidates).toHaveBeenCalled();
    });
  });

  describe('on isActiveClickRow', () => {
    it('should return false when the candidateSummary is null', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      // act
      const result: boolean = spectator.component.isActiveClickRow(null);
  
      // assert
      expect(result).toBeFalse();
    });

    it('should return false when the candidateSummary is undefined', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      // act
      const result: boolean = spectator.component.isActiveClickRow(undefined);
  
      // assert
      expect(result).toBeFalse();
    });

    it('should return false when the currentId does not match the candidateSummary', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const newCurrentId: number = 11;
      const candidateSummary: CandidateSummary = <CandidateSummary>{ candidateId: newCurrentId, name: 'New Cand' }

      // act
      const result: boolean = spectator.component.isActiveClickRow(candidateSummary);
  
      // assert
      expect(result).toBeFalse();
    });

    it('should return true when the currentId matches the candidateSummary', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const newCurrentId: number = 42;
      const candidateSummary: CandidateSummary = <CandidateSummary>{ candidateId: newCurrentId, name: 'New Cand' }

      // act
      const result: boolean = spectator.component.isActiveClickRow(candidateSummary);
  
      // assert
      expect(result).toBeTrue();
    });
  });

  describe('on onClickRow', () => {
    it('should not select a candidate when candidateSummary is null', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const candidateSummary: CandidateSummary | undefined | null = null;
      spyOn(spectator.component.selectCandidate, 'emit');
      const cdRefSpy = spyOn((spectator.component as any)._cdRef, 'markForCheck');

      // act
      spectator.component.onClickRow(candidateSummary);
  
      // assert
      expect(spectator.component.currentId).toBeUndefined();
      expect(spectator.component.selectCandidate.emit).toHaveBeenCalledOnceWith(undefined);
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should not select a candidate when candidateSummary is undefined', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;

      const candidateSummary: CandidateSummary | undefined | null = undefined;
      spyOn(spectator.component.selectCandidate, 'emit');
      const cdRefSpy = spyOn((spectator.component as any)._cdRef, 'markForCheck');

      // act
      spectator.component.onClickRow(candidateSummary);
  
      // assert
      expect(spectator.component.currentId).toBeUndefined();
      expect(spectator.component.selectCandidate.emit).toHaveBeenCalledOnceWith(undefined);
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should select a candidate when candidateSummary is passed through', () => {
      // arrange
      const currentId: number = 42;
      spectator.component.currentId = currentId;
      const newId: number = 11;

      const candidateSummary: CandidateSummary | undefined | null = <CandidateSummary>{ candidateId: newId, name: 'newname' };
      spyOn(spectator.component.selectCandidate, 'emit');
      const cdRefSpy = spyOn((spectator.component as any)._cdRef, 'markForCheck')

      // act
      spectator.component.onClickRow(candidateSummary);
  
      // assert
      expect(spectator.component.currentId).toBe(newId);
      expect(spectator.component.selectCandidate.emit).toHaveBeenCalledOnceWith(newId);
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  it('should find candidates during pageChangeEvent', () => {
    // arrange
    const $event: any = { pageIndex: 0, pageSize: 10 };
    spyOn(spectator.component, 'findCandidates');

    // act
    spectator.component.pageChangeEvent($event);

    // assert
    expect(spectator.component.findCandidates).toHaveBeenCalledOnceWith(0, 10);
  });

  describe('on findCandidates with no paginted candidate results', () => {
    it('should not do anything when finding candidates returns null', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const candidateServiceInstance: CandidateService = (spectator.component as any)._candidateService;

      spyOn(candidateServiceInstance, 'findCandidates').and.callFake(() => of(null));
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');

      spectator.component.paginator = new MatPaginator(new MatPaginatorIntl(), cdRefInstance);
      spectator.component.dataSource = null;
      
      // act
      spectator.detectComponentChanges();
      spectator.component.findCandidates(0, 10);

      // assert
      expect(spectator.component.candidates).toBeUndefined;
      expect(spectator.component.dataSource).toBeNull();
      expect(cdRefSpy).not.toHaveBeenCalled();
    });

    it('should gracefully handle empty paginated candidates being returned from the candidateService', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');
      spectator.component.paginator = null;
      spectator.component.dataSource = null;
      
      // act
      spectator.detectComponentChanges();
      spectator.component.findCandidates(0, 10);

      // assert
      expect(spectator.component.candidates).toBeUndefined();
      expect(spectator.component.dataSource).toBeNull();
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  describe('on findCandidates with candidate results', () => {
    const paginatedCandidates: PagedList<CandidateSummary> | null = <PagedList<CandidateSummary>>{
      pageSize: 10,
      pageIndex: 0,
      items: [
        <CandidateSummary>{ candidateId: 11, name: 'Jon' },
        <CandidateSummary>{ candidateId: 42, name: 'Jon2' },
        <CandidateSummary>{ candidateId: 43, name: 'Jon3' },
      ],
      totalItems: 3
    };

    it('should handle many candidates being returned from the candidateService when called for the first time', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const candidateServiceInstance: CandidateService = (spectator.component as any)._candidateService;

      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');
      spyOn(candidateServiceInstance, 'findCandidates').and.callFake(() => of(paginatedCandidates));
      
      // act
      spectator.component.findCandidates(0, 10);

      // assert
      expect(spectator.component.candidates).toEqual(paginatedCandidates.items);
      expect(spectator.component.dataSource).not.toBeNull();
      expect(spectator.component.dataSource?.paginator).not.toBeNull();
      expect(spectator.component.totalPaginatedItems).toBe(paginatedCandidates.items.length);
      expect(spectator.component.pageIndex).toBe(paginatedCandidates.pageIndex);
      expect(spectator.component.pageSize).toBe(paginatedCandidates.pageSize);
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should handle many candidates being returned from the candidateService when called after the first time', () => {
      // arrange
      const cdRefInstance: ChangeDetectorRef = (spectator.component as any)._cdRef;
      const candidateServiceInstance: CandidateService = (spectator.component as any)._candidateService;

      const cdRefSpy = spyOn(cdRefInstance, 'markForCheck');
      spyOn(candidateServiceInstance, 'findCandidates').and.callFake(() => of(paginatedCandidates));

      const dataSource: MatTableDataSource<CandidateSummary> = new MatTableDataSource<CandidateSummary>(paginatedCandidates.items);
      const paginator: MatPaginator | null = new MatPaginator(new MatPaginatorIntl(), cdRefInstance);

      spectator.component.paginator = paginator;
      spectator.component.dataSource = dataSource;
      spectator.component.dataSource.paginator = paginator;
      
      // act
      spectator.component.findCandidates(0, 10);

      // assert
      expect(spectator.component.candidates).toEqual(paginatedCandidates.items);
      expect(spectator.component.dataSource).toBe(dataSource);
      expect(spectator.component.dataSource?.paginator).toBe(paginator);
      expect(spectator.component.totalPaginatedItems).toBe(paginatedCandidates.items.length);
      expect(spectator.component.pageIndex).toBe(paginatedCandidates.pageIndex);
      expect(spectator.component.pageSize).toBe(paginatedCandidates.pageSize);
      expect(cdRefSpy).toHaveBeenCalled();
    });
  });

  describe('on checking template binding after a change detection cycle', () => {
    it('should show the candidate information template if dataSource exists', () => {
      // arrange
      const candidates: CandidateSummary[] = [<CandidateSummary>{ candidateId: 11, name: 'Only Candidate' }];
      spectator.component.dataSource = new MatTableDataSource<CandidateSummary>(candidates);

      // act
      spectator.detectComponentChanges();

      // assert
      expect(spectator.query('table')).toExist();
      expect(spectator.query('td.mat-column-candidateId')).toHaveText(candidates[0].candidateId.toString());
      expect(spectator.query('td.mat-column-name')).toHaveText(candidates[0].name); 
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

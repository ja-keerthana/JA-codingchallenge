import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take, filter } from 'rxjs/operators';
import { CandidateSummary } from '../../models';
import { CandidateService } from '../../services/candidate.service';
import { PagedList } from '../../../shared/models';

@Component({
  selector: 'app-candidate-summary-table',
  templateUrl: './candidate-summary-table.component.html',
  styleUrls: ['./candidate-summary-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateSummaryTableComponent implements OnInit {
  @Output() public selectCandidate: EventEmitter<number> = new EventEmitter<number>();

  public candidates: CandidateSummary[] | undefined | null = undefined;
  public currentId: number | undefined = undefined;
  public displayedColumns: string[] = ['candidateId', 'name'];
  public dataSource: MatTableDataSource<CandidateSummary> | null = null;
  public totalPaginatedItems: number = 0;
  public pageIndex: number = 0;
  public pageSize: number = 0;

  constructor(private _cdRef: ChangeDetectorRef, private _candidateService: CandidateService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  ngOnInit() {
    this.findCandidates(0, 10);
  }

  public isActiveClickRow(row: CandidateSummary | undefined | null): boolean {
    return this.currentId === row?.candidateId;
  }

  public onClickRow(row: CandidateSummary | undefined | null): void {
    this.currentId = row?.candidateId;
    this.selectCandidate.emit(row?.candidateId);
    this._cdRef.markForCheck();
  }

  public pageChangeEvent($event: any): void {
    this.findCandidates($event.pageIndex, $event.pageSize);
  }

  public findCandidates(pageIndex: number, pageSize: number): void {
    this._candidateService
      .findCandidates(pageIndex, pageSize)
      .pipe(
        take(1),
        filter((candidatePagedList: PagedList<CandidateSummary> | null) => !!candidatePagedList)
      )
      .subscribe((candidatePagedList: PagedList<CandidateSummary> | null) => {
        this.candidates = candidatePagedList?.items;

        if(candidatePagedList?.items?.length && !this.dataSource){
          this.dataSource = new MatTableDataSource<CandidateSummary>(candidatePagedList?.items);
          this.dataSource.paginator = this.paginator;
        }
        else if (candidatePagedList?.items?.length && !!this.dataSource) {
          this.dataSource.data = candidatePagedList?.items;
        }
        
        this.totalPaginatedItems = candidatePagedList?.totalItems ?? 0;
        this.pageIndex = candidatePagedList?.pageIndex ?? 0;
        this.pageSize = candidatePagedList?.pageSize ?? 0;

        this._cdRef.markForCheck();
      });
  }
}

import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take, filter } from 'rxjs/operators';
import { JobSummary } from '../../models';
import { JobService } from '../../services/job.service';
import { PagedList } from '../../../shared/models';

@Component({
  selector: 'app-job-summary-table',
  templateUrl: './job-summary-table.component.html',
  styleUrls: ['./job-summary-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobSummaryTableComponent implements OnInit {
  @Output() public selectJob: EventEmitter<number> = new EventEmitter<number>();

  public jobs: JobSummary[] | undefined | null = undefined;
  public currentId: number | undefined = undefined;
  public displayedColumns: string[] = ['jobId', 'name'];
  public dataSource: MatTableDataSource<JobSummary> | null = null;
  public totalPaginatedItems: number = 0;
  public pageIndex: number = 0;
  public pageSize: number = 0;

  constructor(private _cdRef: ChangeDetectorRef, private _jobService: JobService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  ngOnInit() {
    this.findJobs(0,10);
   }

  public isActiveClickRow(row: JobSummary | undefined | null): boolean {
    return this.currentId === row?.jobId;
  }

  public onClickRow(row: JobSummary | undefined | null): void {
    this.currentId = row?.jobId;
    this.selectJob.emit(row?.jobId);
    this._cdRef.markForCheck();
  }

  public pageChangeEvent($event: any): void {
    this.findJobs($event.pageIndex, $event.pageSize);
  }

  public findJobs(pageIndex: number, pageSize: number): void {
    this._jobService
      .findJobs(pageIndex, pageSize)
      .pipe(
        take(1),
        filter((jobPagedList: PagedList<JobSummary> | null) => !!jobPagedList)
      )
      .subscribe((jobPagedList: PagedList<JobSummary> | null) => {
        this.jobs = jobPagedList?.items;

        if(jobPagedList?.items?.length && !this.dataSource){
          this.dataSource = new MatTableDataSource<JobSummary>(jobPagedList?.items);
          this.dataSource.paginator = this.paginator;
        }
        else if (jobPagedList?.items?.length && !!this.dataSource) {
          this.dataSource.data = jobPagedList?.items;
        }

        this.totalPaginatedItems = jobPagedList?.totalItems ?? 0;
        this.pageIndex = jobPagedList?.pageIndex ?? 0;
        this.pageSize = jobPagedList?.pageSize ?? 0;

        this._cdRef.markForCheck();
      });
  }
}

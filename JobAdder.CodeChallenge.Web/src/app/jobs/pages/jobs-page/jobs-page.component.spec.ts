import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { RouterOutlet } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { JobsPageComponent } from './jobs-page.component';
import { JobSummaryTableComponent, JobDetailComponent } from '../../components';

describe('JobsPageComponent', () => {
  let spectator: Spectator<JobsPageComponent>

  const createComponent = createComponentFactory({
    component: JobsPageComponent,
    declarations: [ MockComponent(JobSummaryTableComponent), MockComponent(JobDetailComponent), RouterOutlet ],
    imports: [ MatDividerModule, MatIconModule ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the jobs page component', () => {
    expect(spectator).toBeTruthy();
  });

  it('should not have a selected jobId on page load', () => {
    const result: number | undefined = spectator.component.selectedJobId;
    expect(result).toBeUndefined();
  });

  it('should be able to select a jobId', () => {
    // arrange
    const newJobId: number = 42;

    // act
    spectator.component.selectJob(newJobId);

    // assert
    const result: number | undefined = spectator.component.selectedJobId;
    expect(result).toBe(newJobId);
  });

  it('should update jobId when JobSummaryTableComponent emits a selectJob event', () => {
    // arrange
    const expectedInput: number = 42;
    spectator.component.selectedJobId = 11;

    // act
    spectator.query(JobSummaryTableComponent)?.selectJob.emit(expectedInput);
    spectator.detectChanges();

    // assert
    expect(spectator.component.selectedJobId).toBe(expectedInput);
  });
});

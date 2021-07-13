import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockService } from 'ng-mocks';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NavbarComponent } from '..';
import { NavigationItem } from '../../models';

describe('NavbarComponent', () => {
  let spectator: Spectator<NavbarComponent>;

  // set mock service global defaults
  // overrides global functions
  const cdRefMock = MockService(ChangeDetectorRef, <Partial<ChangeDetectorRef>>{
    markForCheck: (): void => {}
  });
  const routerMock = MockService(Router, <Partial<Router>>{
    url: 'candidates'
  });

  const createComponent = createComponentFactory({
    component: NavbarComponent,
    imports: [ MatIconModule, MatTooltipModule ],
    providers: [
      { provide: Router, useValue: routerMock },
      { provide: ChangeDetectorRef, useValue: cdRefMock }
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('on component initialisation', () => {
    it('should initialise the component', () => {
      expect(spectator).toBeTruthy();
    })

    it('should trigger change detection cycle after the initial view initialisation', () => {
      // arrange
      const cdRefSpy = spyOn((spectator.component as any)._cdRef, 'markForCheck');

      // act
      spectator.component.ngAfterViewInit();

      // assert
      expect(cdRefSpy).toHaveBeenCalled();
    });

    it('should have 2 url routes', () => {
      // arrange
      const navigationItems: NavigationItem[] = [
        { title: 'Candidates', icon: 'emoji_people', route: 'candidates' } as NavigationItem,
        { title: 'Jobs', icon: 'work', route: 'jobs'} as NavigationItem,
      ];

      // assert
      expect(spectator.component.navigationItems).toEqual(navigationItems);
    });
  });

  describe('on navigation', () => {
    const navigationItems: NavigationItem[] = [
      { title: 'Candidates', icon: 'emoji_people', route: 'candidates' } as NavigationItem,
      { title: 'Jobs', icon: 'work', route: 'jobs'} as NavigationItem,
    ];

    it('should navigate to navigation item route URL', async () => {
      // arrange
      const navItem: NavigationItem = navigationItems[1];
      const routerInstance: Router = (spectator.component as any)._router;
      const routerSpy = spyOn(routerInstance, 'navigate').and.callFake(() => <Promise<boolean>>{});

      // act
      await spectator.component.navigateTo(navItem);

      // assert
      expect(routerSpy).toHaveBeenCalledOnceWith([navItem.route]);
    });

    it('should return true when url is active', async () => {
      // arrange
      const navItem: NavigationItem = navigationItems[0]; // candidates
      // where candidates is the global mocked value specified at the top of the testclass

      // act
      const result: boolean = await spectator.component.isActive(navItem);

      // assert
      expect(result).toBeTrue();
    });

    it('should return false when url is not active', async () => {
      // arrange
      const navItem: NavigationItem = navigationItems[1]; // jobs
      // where candidates is the global mocked value specified at the top of the testclass

      // act
      const result: boolean = await spectator.component.isActive(navItem);

      // assert
      expect(result).toBeFalse();
    });
  });
});

import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { NavbarComponent } from './shared/components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>

  const createComponent = createComponentFactory({
    component: AppComponent,
    componentMocks: [ NavbarComponent ],
    mocks: [ Router ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator).toBeTruthy();
  });

  it('should have the correct title', () => {
    const expectedTitle: string = 'JobAdder CodeChallenge';

    const result: string = spectator.component.title;
    expect(result).toBe(expectedTitle);
  });

  it('should navigate to candidates after the view initialises', async () => {
    // arrange
    const routerSpy = spectator.inject(Router);
    routerSpy.navigate.and.callFake;

    // act
    await spectator.component.ngAfterViewInit();

    // assert
    expect(routerSpy.navigate).toHaveBeenCalledWith(['candidates']);
  });
});

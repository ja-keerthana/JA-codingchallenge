import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationItem } from '../../models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements AfterViewInit {

  constructor(private _router: Router, private _cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this._cdRef.markForCheck();
  }

  public navigationItems: NavigationItem[] = [
    { title: 'Candidates', icon: 'emoji_people', route: 'candidates' } as NavigationItem,
    { title: 'Jobs', icon: 'work', route: 'jobs'} as NavigationItem,
  ];

  public async navigateTo(navItem: NavigationItem): Promise<void> {
    await this._router.navigate([navItem.route]);
  }

  public isActive(navItem: NavigationItem): boolean {
    return this._router.url.includes(navItem.route);
  }
}
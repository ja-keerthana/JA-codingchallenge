import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'JobAdder CodeChallenge';

  constructor(private _router: Router) {}

  async ngAfterViewInit() {
    await this._router.navigate(['candidates']);
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('password') password: ElementRef | undefined;
  @ViewChild('menuBurger') menuBurger: ElementRef | undefined;
  @ViewChild('menuMain') menuMain: ElementRef | undefined;

  constructor(private api: ApiService) { }

  public get isAuthenticated(): boolean | null {
    return this.api.hasToken;
  }

  public loginEvent(event: Event): void {
    event.preventDefault();
    var data = new FormData(event.target as HTMLFormElement);
    this.api.setToken(data.get('password') as string);
  }

  public logout(): void {
    this.api.clearToken();
  }

  public toggleMenu(): void {
    this.menuBurger!.nativeElement.classList.toggle('is-active');
    this.menuMain!.nativeElement.classList.toggle('is-active');
  }
}

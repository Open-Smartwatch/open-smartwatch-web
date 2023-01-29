import { Component } from '@angular/core';
import { ApiBuildFlag, ApiService } from '../api.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  public tags: ApiBuildFlag[] | undefined;
  public loading: boolean = true;
  public error: string = '';

  constructor(private apiService: ApiService) { }

  public async ngOnInit(): Promise<void> {
    try {
      this.tags = await this.apiService.getBuildFlags();
    } catch (e) {
      this.error = `${e}`;
    }
    this.loading = false;
  }
}

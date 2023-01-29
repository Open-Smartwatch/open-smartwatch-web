import { Component } from '@angular/core';
import { ApiConfigCategory, ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  public categories: ApiConfigCategory[] | undefined;
  public error: string = '';
  public loading: boolean = true;

  constructor(private apiService: ApiService) { }

  public async ngOnInit(): Promise<void> {
    try {
      this.categories = await this.apiService.getConfigCategories();
    } catch (e) {
      this.error = `${e}`;
    }
    this.loading = false;
  }
}

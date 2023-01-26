import { Component } from '@angular/core';
import { ApiConfigCategory, ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  public categories: ApiConfigCategory[] | null = null;

  constructor(private apiService: ApiService) { }

  public async ngOnInit(): Promise<void> {
    this.categories = await this.apiService.getConfigCategories();
  }
}

import { Component } from '@angular/core';
import { ApiConfigCategory, ApiService } from 'src/app/api.service';
import { ConfigCacheService } from '../config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  public categories: ApiConfigCategory[] | undefined;
  public error: string = '';
  public loading: boolean = true;

  constructor(private apiService: ApiService, private configCache: ConfigCacheService) { }

  public async ngOnInit(): Promise<void> {
    await this.update();
  }

  private async update(): Promise<void> {
    this.loading = true;
    try {
      this.categories = await this.configCache.getConfigCategories();
    } catch (e) {
      this.error = `${e}`;
    }
    this.loading = false;
  }

  public async reset(): Promise<void> {
    await this.apiService.triggerReset(false);
    await this.update();
  }
}

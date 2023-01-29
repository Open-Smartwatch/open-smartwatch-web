import { Component } from '@angular/core';
import { ApiConfigCategory } from 'src/app/api.service';
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

  constructor(private configCache: ConfigCacheService) { }

  public async ngOnInit(): Promise<void> {
    try {
      this.categories = await this.configCache.getConfigCategories();
    } catch (e) {
      this.error = `${e}`;
    }
    this.loading = false;
  }
}

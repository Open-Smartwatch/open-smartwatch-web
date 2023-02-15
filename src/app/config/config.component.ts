import { Component } from '@angular/core';
import { ApiConfigCategory, ApiConfigCategoryField, ApiService } from 'src/app/api.service';
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
  public importProgress: number | null = null;

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
    this.configCache.clear();
    await this.update();
  }

  public async export(): Promise<void> {
    let data: {[id: string]: string} = {};
    for(let [id, field] of this.configCache.getCachedFields()) {
      data[id] = field.value;
    }
    let blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public async import(event: Event): Promise<void> {
    let input = event.target as HTMLInputElement;
    if(input.files === null || input.files.length === 0)
      return;
    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = async (event) => {
      let data = JSON.parse(event.target!.result as string);
      this.importProgress = 0;
      let progress = 0;
      let asyncSetter = async (id: string) => {
        let field: ApiConfigCategoryField = await this.configCache.getConfigCategoryField(id);
        field.value = data[id];
        await this.apiService.setConfigCategoryField(field);
        progress++;
        this.importProgress = progress / Object.keys(data).length;
      };
      let setters = [];
      for(let id in data) {
        setters.push(asyncSetter(id));
      }
      await Promise.all(setters);
      this.importProgress = null;
    };
    reader.readAsText(file);
  }
}

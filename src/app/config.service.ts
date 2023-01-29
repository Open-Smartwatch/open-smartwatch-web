import { Injectable } from '@angular/core';
import { ApiService, ApiConfigCategory, ApiConfigCategoryField } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigCacheService {
  private cacheFields = new Map<string, ApiConfigCategoryField>();
  private cacheFieldsTTL = new Map<string, number>();
  private cacheCategories: ApiConfigCategory[] | undefined;

  constructor(private apiService: ApiService) { }

  public async getConfigCategories(): Promise<ApiConfigCategory[]> {
    this.cacheCategories = this.cacheCategories || await this.apiService.getConfigCategories();
    return this.cacheCategories;
  }

  public async getConfigCategoryField(id: string): Promise<ApiConfigCategoryField> {
    if(!this.cacheFields.has(id)) {
      this.cacheFields.set(id, await this.apiService.getConfigCategoryField(id));
      this.cacheFieldsTTL.set(id, Date.now() + 60 * 1000); // 60 seconds cache of values
    }
    if(this.cacheFieldsTTL.get(id)! < Date.now())
      this.apiService.getConfigCategoryField(id).then((field) => {
        this.cacheFields.get(id)!.value = field.value; // Update the value, just in case
      });
    return this.cacheFields.get(id)!;
  }
}

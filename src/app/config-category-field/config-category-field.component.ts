import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ApiConfigCategoryFieldType, ApiConfigCategoryField, ApiService } from '../api.service';
import { ConfigCacheService } from '../config.service';

@Component({
  selector: 'div[app-config-category-field]',
  templateUrl: './config-category-field.component.html',
  styleUrls: ['./config-category-field.component.css']
})
export class ConfigCategoryFieldComponent {
  public types = ApiConfigCategoryFieldType; // To use it in the template
  @Input() public id: string = '';
  public field: ApiConfigCategoryField | undefined;
  public loading: boolean = true;
  public error: string = '';
  public syncState: string = '';
  private syncStateClearTimeout: number | null = null;
  @ViewChild('control') control: ElementRef | null = null;

  constructor(private apiService: ApiService, private configCache: ConfigCacheService) { }

  public async ngOnInit(): Promise<void> {
    try {
      this.field = await this.configCache.getConfigCategoryField(this.id);
    } catch (e) {
      this.error = `${e}`;
    }
    this.loading = false;
  }

  public async onChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.value !== this.field!.value) {
      if (this.syncStateClearTimeout) {
        window.clearTimeout(this.syncStateClearTimeout);
        this.syncStateClearTimeout = null;
      }

      this.control!.nativeElement.classList.add('is-loading');
      this.syncState = '';
      this.error = '';
      input.setAttribute('disabled', '');
      if(this.field!.type === ApiConfigCategoryFieldType.BOOL)
        this.field!.value = input.checked ? 'true' : 'false';
      else
        this.field!.value = input.value;

      try {
        await this.sync();
        this.syncState = ' ✅';
        
        this.syncStateClearTimeout = window.setTimeout(() => {
          this.syncState = '';
          this.syncStateClearTimeout = null;
        }, 3000);
      } catch (e) {
        console.error('Failed to sync field', this.field!.id, 'to value', this.field!.value, 'with error', e);
        this.syncState = ' ❌';
        this.error = `${e}`;
      }
      this.control!.nativeElement.classList.remove('is-loading');
      input.removeAttribute('disabled');
    }
  }

  public async sync(): Promise<void> {
    await this.apiService.setConfigCategoryField(this.field!);
  }
}

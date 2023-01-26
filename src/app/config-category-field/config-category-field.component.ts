import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ApiConfigCategoryFieldType, ApiConfigCategoryField, ApiService } from '../api.service';

@Component({
  selector: 'div[app-config-category-field]',
  templateUrl: './config-category-field.component.html',
  styleUrls: ['./config-category-field.component.css']
})
export class ConfigCategoryFieldComponent {
  public types = ApiConfigCategoryFieldType; // To use it in the template
  @Input() public id: string = '';
  public field: ApiConfigCategoryField | null = null;
  public syncState: string = '';
  public syncMessage: string = '';
  private syncStateClearTimeout: number | null = null;
  @ViewChild('control') control: ElementRef | null = null;

  constructor(private apiService: ApiService) { }

  public async ngOnInit(): Promise<void> {
    this.field = await this.apiService.getConfigCategoryField(this.id);
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
      this.syncMessage = '';
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
        this.syncMessage = `${e}`;
      }
      this.control!.nativeElement.classList.remove('is-loading');
      input.removeAttribute('disabled');
    }
  }

  public async sync(): Promise<void> {
    console.log('Syncing field', this.field!.id, 'to value', this.field!.value);
    await this.apiService.setConfigCategoryField(this.field!);
  }
}

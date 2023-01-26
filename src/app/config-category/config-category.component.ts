import { Component, Input } from '@angular/core';
import { ApiConfigCategory } from 'src/app/api.service';

@Component({
  selector: 'app-config-category[category]',
  templateUrl: './config-category.component.html',
  styleUrls: ['./config-category.component.css']
})
export class ConfigCategoryComponent {
  @Input() public category: ApiConfigCategory | null = null;
  public name: string = '';
  public fieldIds: string[] = [];

  public async ngOnInit(): Promise<void> {
    this.name = this.category!.name;
    this.fieldIds = this.category!.keys;
  }
}

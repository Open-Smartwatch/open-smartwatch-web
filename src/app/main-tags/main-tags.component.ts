import { Component } from '@angular/core';
import { ApiService, ApiBuildFlag } from 'src/app/api.service';

@Component({
  selector: 'app-main-tags',
  templateUrl: './main-tags.component.html',
  styleUrls: ['./main-tags.component.css']
})
export class MainTagsComponent {
  public tags: ApiBuildFlag[] | null = null;

  constructor(private apiService: ApiService) { }

  public async ngOnInit(): Promise<void> {
    this.tags = await this.apiService.getBuildFlags();
  }  
}

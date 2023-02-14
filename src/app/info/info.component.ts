import { Component } from '@angular/core';
import { ApiBuildFlag, ApiService } from '../api.service';
import { VERSION } from '../../environments/version';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  public tagsApi: ApiBuildFlag[] | undefined;
  public tagsUI: ApiBuildFlag[] = [];
  public tagsLoading: boolean = true;
  public actionLoading: boolean = false;
  public error: string = '';

  constructor(private apiService: ApiService) { }

  public async ngOnInit(): Promise<void> {
    this.tagsUI.push({
      name: 'Version',
      value: VERSION.version
    });
    this.tagsUI.push({
      name: 'Git Commit Hash',
      value: VERSION.hash + (VERSION.dirty ? '-dirty' : '')
    });
    try {
      this.tagsApi = await this.apiService.getBuildFlags();
    } catch (e) {
      this.error = `${e}`;
    }
    this.tagsLoading = false;
  }

  public async reboot(): Promise<void> {
    this.actionLoading = true;
    await this.apiService.triggerReboot();
    this.actionLoading = false;
  }

  public async reset(clearNVS: boolean): Promise<void> {
    this.actionLoading = true;
    await this.apiService.triggerReset(clearNVS);
    this.actionLoading = false;
  }
}

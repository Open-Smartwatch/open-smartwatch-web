import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

export class ApiBuildFlag {
  constructor(public name: string, public value: string) { }
}

export class ApiConfigCategory {
  constructor(public name: string, public keys: string[]) { }
}

export enum ApiConfigCategoryFieldType {
  // Copy-pasted from the C** code...
  STRING = 'S',
  PASSWORD = 'P',
  DROPDOWN = 'd',
  ULONG = 'L',
  INT = 'I',
  SHORT = 'i',
  RGB = 'R',
  BOOL = 'C',
  DOUBLE = 'D',
  FLOAT = 'F'
}

export class ApiConfigCategoryField {
  constructor(
    public id: string,
    public type: ApiConfigCategoryFieldType,
    public label: string,
    public help: string | null,
    public value: string,
    public syncing: boolean = false
  ) { }

  public get checked(): boolean {
    // This function ensures a boolean value is returned - and not a string
    return this.value === 'true';
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token: string | null = null;
  private _hasToken: boolean | null = false;

  public get hasToken(): boolean | null {
    return this._hasToken;
  }

  constructor() {
    // load token from local storage and try to use it
    const token = sessionStorage.getItem('token');
    if(token !== null) {
      this.setToken(token);
    }
  }

  private delay(func: () => void): void {
    setTimeout(func, 1000);
  }

  public async setAuthentication(username: string, password: string): Promise<void> {
    await this.setToken(btoa(username + ':' + password));
  }

  private async setToken(token: string): Promise<void> {
    // Set the token
    this.token = token;
    // Try to use it
    try {
      this._hasToken = null; // we do not know yet
      await this.getBuildFlags(); // test the token by performing a simple request
    } catch(e) {
      // well, this did not work out -> the token was wrong (and already dropped)
      return;
    }
    // If we get here, the token was correct
    sessionStorage.setItem('token', this.token);
    this._hasToken = true;
  }

  public clearToken(includePersistant: boolean = true): void {
    this.token = null;
    this._hasToken = false;
    if(includePersistant) {
      sessionStorage.removeItem('token');
    }
  }

  public makePath(path: string): string {
    return environment.api.endpoint + path;
  }

  public getAuthenticatedFetch(path: string, method: string, contentType: string | null = null, body: string | null = null) {
    var headers: any = {};
    if(this.token !== null)
      headers['Authorization'] = `Basic ${this.token!}`;
    if(contentType !== null)
      headers['Content-Type'] = contentType;
    return fetch(this.makePath(path), {
      method: method,
      headers: headers,
      body: body
    }).then(response => {
      if(response.status === 401) {
        this.clearToken(false); // Do not drop token from local storage, maybe the backend was not correctly connected
      }
      if(!response.ok)
        throw new Error('HTTP error, status = ' + response.status);
      return response;
    });
  }

  public authenticateXhr(xhr: XMLHttpRequest): void {
    if(this.token === null)
      throw new Error('No token available');
    xhr.setRequestHeader('Authorization', `Basic ${this.token!}`);
  }

  public getBuildFlags(): Promise<ApiBuildFlag[]> {
    return new Promise((resolve, reject) => {
      const flags: ApiBuildFlag[] = [];
      if(environment.api.mock) {
        flags.push(new ApiBuildFlag('Boot Count', '1'));
        flags.push(new ApiBuildFlag('Build Timestamp', '2020-01-01 00:00:00'));
        flags.push(new ApiBuildFlag('Compiler Version', '1.0.0'));
        flags.push(new ApiBuildFlag('Git Branch Name', 'master'));
        flags.push(new ApiBuildFlag('Git Commit Hash', '00000000'));
        flags.push(new ApiBuildFlag('Git Commit Timestamp', '2020-01-01 00:00:00'));
        flags.push(new ApiBuildFlag('PlatformIO Environment', 'dev'));
        this.delay(() => resolve(flags));
      } else {
        this.getAuthenticatedFetch('/api/info', 'GET').then(response => response.json()).then(json => {
          flags.push(new ApiBuildFlag('Boot Count', json.bc));
          flags.push(new ApiBuildFlag('Build Timestamp', json.t));
          flags.push(new ApiBuildFlag('Compiler Version', json.v));
          flags.push(new ApiBuildFlag('Git Branch Name', json.gb));
          flags.push(new ApiBuildFlag('Git Commit Hash', json.gh));
          flags.push(new ApiBuildFlag('Git Commit Timestamp', new Date(json.gt).toLocaleString()));
          flags.push(new ApiBuildFlag('PlatformIO Environment', json.pe));
          resolve(flags);
        }).catch(error => reject);
      }
    });
  }

  public getConfigCategories(): Promise<ApiConfigCategory[]> {
    return new Promise((resolve, reject) => {
      const categories: ApiConfigCategory[] = [];
      if(environment.api.mock) {
        categories.push(new ApiConfigCategory('General', ['a', 'b', 'c']));
        categories.push(new ApiConfigCategory('Display', ['d', 'e', 'f']));
        categories.push(new ApiConfigCategory('Design', ['g', 'h']));
        categories.push(new ApiConfigCategory('Other', ['i']));
        this.delay(() => resolve(categories));
      } else {
        this.getAuthenticatedFetch('/api/config/categories', 'GET').then(response => response.json()).then(json => {
          for(const category in json.categories) {
            categories.push(new ApiConfigCategory(category, json.categories[category]));
          }
          resolve(categories);
        }).catch(error => reject);
      }
    });
  }

  public getConfigCategoryField(id: string): Promise<ApiConfigCategoryField> {
    return new Promise((resolve, reject) => {
      if(environment.api.mock) {
        var idToField: any = {
          'a': new ApiConfigCategoryField('a', ApiConfigCategoryFieldType.STRING, 'Label_a', null, 'string'),
          'b': new ApiConfigCategoryField('b', ApiConfigCategoryFieldType.PASSWORD, 'Label_b', 'Help_b', 'password'),
          'c': new ApiConfigCategoryField('c', ApiConfigCategoryFieldType.DROPDOWN, 'Label_c', '1,2,3,4,5', '3'),
          'd': new ApiConfigCategoryField('d', ApiConfigCategoryFieldType.ULONG, 'Label_d', 'Help_d', '1000000'),
          'e': new ApiConfigCategoryField('e', ApiConfigCategoryFieldType.INT, 'Label_e', 'Help_e', '10000'),
          'f': new ApiConfigCategoryField('f', ApiConfigCategoryFieldType.SHORT, 'Label_f', 'Help_f', '32000'),
          'g': new ApiConfigCategoryField('g', ApiConfigCategoryFieldType.RGB, 'Label_g', 'Help_g', '#ffee00'),
          'h': new ApiConfigCategoryField('h', ApiConfigCategoryFieldType.BOOL, 'Label_h', 'Help_h', 'false'),
          'i': new ApiConfigCategoryField('i', ApiConfigCategoryFieldType.DOUBLE, 'Label_i', 'Help_i', '0.0042'),
          'j': new ApiConfigCategoryField('j', ApiConfigCategoryFieldType.FLOAT, 'Label_j', 'Help_j', '0.42')
        };
        this.delay(() => resolve(id in idToField ? idToField[id] :
          new ApiConfigCategoryField(
            id,
            ApiConfigCategoryFieldType.STRING,
            'Label_' + id,
            'Help_' + id,
            'value_' + id
          ))
        );
      } else {
        this.getAuthenticatedFetch('/api/config/field?id=' + id, 'GET').then(response => response.json()).then(json => {
          resolve(new ApiConfigCategoryField(id, json.type, json.label, json.help, json.value));
        }).catch(error => reject);
      }
    });
  }

  public setConfigCategoryField(field: ApiConfigCategoryField): Promise<void> {
    field.syncing = true;
    return new Promise((resolve, reject) => {
      if(environment.api.mock) {
        if(field.id == 'c' && Math.random() < 0.5)
          reject('random failure to mock you');
        else
          this.delay(resolve);
        field.syncing = false; // syncing may finish before the success callback
      } else {
        this.getAuthenticatedFetch(
          '/api/config/field?id=' + field.id + '&value=' + encodeURIComponent(field.value),
          'PUT'
        ).then(response => {
          if(response.ok) {
            resolve();
          } else {
            reject();
          }
        }).catch(error => reject).finally(() => field.syncing = false);
      }
    });
  }

  public triggerReboot(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(environment.api.mock) {
        this.delay(resolve);
      } else {
        this.getAuthenticatedFetch('/api/reboot', 'GET').then(response => {
          if(response.ok) {
            resolve();
          } else {
            reject();
          }
        }).catch(error => reject);
      }
    });
  }

  public triggerReset(clearNVS: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if(environment.api.mock) {
        this.delay(resolve);
      } else {
        this.getAuthenticatedFetch('/api/config/reset' + (clearNVS ? '?clearNVS' : ''), 'GET').then(response => {
          if(response.ok) {
            resolve();
          } else {
            reject();
          }
        }).catch(error => reject);
      }
    });
  }

}

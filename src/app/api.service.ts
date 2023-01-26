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
    public value: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private delay(func: () => void): void {
    setTimeout(func, 1000);
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
        fetch('/api/info').then(response => response.json()).then(json => {
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
        fetch('/api/config/categories').then(response => response.json()).then(json => {
          // TODO
          // for(const category in json) {
          //   categories.push(new ApiConfigCategory(category, json[category]));
          // }
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
        fetch('/api/config/field' + id).then(response => response.json()).then(json => {
          // TODO
          // resolve(new ApiConfigCategoryField(id, json.type, json.label, json.help));
        }).catch(error => reject);
      }
    });
  }

  public setConfigCategoryField(field: ApiConfigCategoryField): Promise<void> {
    return new Promise((resolve, reject) => {
      if(environment.api.mock) {
        if(field.id == 'c' && Math.random() < 0.5)
          reject('random failure to mock you');
        else
          this.delay(resolve);
      } else {
        fetch('/api/config/field' + field.id, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: field.value
        }).then(response => {
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

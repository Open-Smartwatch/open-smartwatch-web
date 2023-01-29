import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpdateComponent } from './update/update.component';
import { ConfigComponent } from './config/config.component';
import { ConfigCategoryComponent } from './config-category/config-category.component';
import { ConfigCategoryFieldComponent } from './config-category-field/config-category-field.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateComponent,
    ConfigComponent,
    ConfigCategoryComponent,
    ConfigCategoryFieldComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MainRootComponent } from './main/main.component';
import { MainTagsComponent } from './main-tags/main-tags.component';
import { UpdateComponent } from './update/update.component';
import { ConfigComponent } from './config/config.component';
import { ConfigCategoryComponent } from './config-category/config-category.component';
import { ConfigCategoryFieldComponent } from './config-category-field/config-category-field.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    MainRootComponent,
    MainTagsComponent,
    UpdateComponent,
    ConfigComponent,
    ConfigCategoryComponent,
    ConfigCategoryFieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

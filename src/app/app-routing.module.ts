import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainRootComponent } from './main/main.component';
import { UpdateComponent } from './update/update.component';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
  { path: '', component: MainRootComponent },
  { path: 'update', component: UpdateComponent },
  { path: 'config', component: ConfigComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

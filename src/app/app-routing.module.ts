import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '', component: FirstpageComponent
  },
  {
    path: 'view/:id', component: ViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

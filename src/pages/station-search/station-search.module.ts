import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationSearchPage } from './station-search';

@NgModule({
  declarations: [
    StationSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(StationSearchPage),
  ],
})
export class StationSearchPageModule {}

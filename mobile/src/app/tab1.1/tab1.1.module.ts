import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab11PageRoutingModule } from './tab1.1-routing.module';

import { Tab11Page } from './tab1.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab11PageRoutingModule
  ],
  declarations: [Tab11Page]
})
export class Tab11PageModule {}

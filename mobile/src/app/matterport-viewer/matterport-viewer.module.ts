import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatterportViewerComponent } from './matterport-viewer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MatterportViewerComponent],
  exports: [MatterportViewerComponent],
})
export class MatterportViewerModule {}

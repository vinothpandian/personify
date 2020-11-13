import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { GraphComponent } from './graph.component';

@NgModule({
  declarations: [GraphComponent],
  imports: [CommonModule, NgSelectModule],
  exports: [GraphComponent],
})
export class GraphModule {}

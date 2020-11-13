import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GraphComponent } from './graph.component';

@NgModule({
  declarations: [GraphComponent],
  imports: [CommonModule, NgSelectModule, FormsModule],
  exports: [GraphComponent],
})
export class GraphModule {}

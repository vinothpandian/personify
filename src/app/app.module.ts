import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AccessibilityPanelComponent } from './accessibility-panel/accessibility-panel.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphModule } from './graph/graph.module';
import { InformationPanelComponent } from './information-panel/information-panel.component';
import { NavigationPanelComponent } from './navigation-panel/navigation-panel.component';
import { PersonaPanelComponent } from './persona-panel/persona-panel.component';
import { AccessibilityCardComponent } from './accessibility-panel/accessibility-card/accessibility-card.component';
import { GuidelineCardComponent } from './information-panel/guideline-card/guideline-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationPanelComponent,
    AccessibilityPanelComponent,
    PersonaPanelComponent,
    InformationPanelComponent,
    AccessibilityCardComponent,
    GuidelineCardComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, GraphModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

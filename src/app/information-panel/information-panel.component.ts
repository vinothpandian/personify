import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Neo4jService } from '../core/services/neo4j.service';
import { Guideline, Persona } from '../models';

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit, OnDestroy {
  persona: Persona = {} as Persona;

  guidelines: Guideline[] = [];

  personaSubscription: Subscription;
  guidelineSubscription: Subscription;

  constructor(private neo4jService: Neo4jService) {}

  ngOnInit(): void {
    this.personaSubscription = this.neo4jService.selectedPersona$.subscribe(
      (persona) => {
        this.persona = persona;
      }
    );

    this.guidelineSubscription = this.neo4jService.guidelines$.subscribe(
      (guidelines) => {
        this.guidelines = guidelines;
      }
    );
  }

  ngOnDestroy(): void {
    this.personaSubscription.unsubscribe();
    this.guidelineSubscription.unsubscribe();
  }
}

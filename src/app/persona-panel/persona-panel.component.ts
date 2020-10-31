import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Neo4jService } from '../core/services/neo4j.service';

@Component({
  selector: 'app-persona-panel',
  templateUrl: './persona-panel.component.html',
  styleUrls: ['./persona-panel.component.scss'],
})
export class PersonaPanelComponent implements OnInit, OnDestroy {
  personaImages = [];

  private personaSubscription: Subscription;

  constructor(private neo4jService: Neo4jService) {}

  ngOnInit(): void {
    this.personaSubscription = this.neo4jService.personas$.subscribe(
      (personas) => {
        this.personaImages = personas.map((persona) => {
          const imageURL = encodeURI(
            `https://designwithpersonify.com/f/avatars/${persona.name}.png`
          );
          console.log(imageURL);
          return imageURL;
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.personaSubscription.unsubscribe();
  }
}

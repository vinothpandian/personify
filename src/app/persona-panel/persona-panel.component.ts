import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Neo4jService } from '../core/services/neo4j.service';
import { Persona } from '../models';

@Component({
  selector: 'app-persona-panel',
  templateUrl: './persona-panel.component.html',
  styleUrls: ['./persona-panel.component.scss'],
})
export class PersonaPanelComponent implements OnInit, OnDestroy {
  personas: { name: string; image: string }[] = [];

  allPersonas: {
    [name: string]: Persona;
  } = {};

  currentPersona = '';

  private personaSubscription: Subscription;
  private selectedPersonaSubscription: Subscription;

  constructor(private neo4jService: Neo4jService) {}

  ngOnInit(): void {
    this.personaSubscription = this.neo4jService.personas$.subscribe(
      (personas) => {
        this.allPersonas = personas.reduce((acc, persona) => {
          return {
            ...acc,
            [persona.name]: persona,
          };
        }, {});

        this.personas = personas.map((persona) => {
          const imageURL = encodeURI(
            `https://designwithpersonify.com/f/avatars/${persona.name}.png`
          );

          return {
            name: persona.name,
            image: imageURL,
          };
        });
      }
    );

    this.selectedPersonaSubscription = this.neo4jService.selectedPersona$.subscribe(
      (persona) => {
        this.currentPersona = persona.name;
      }
    );
  }

  selectPersona(name: string): void {
    const persona = this.allPersonas[name];
    this.neo4jService.query(
      `MATCH (n:Persona)-[r]-(m) where n.name='${name}' return n,r,m`,
      false
    );
    this.neo4jService.selectedPersona$.next(persona);
  }

  ngOnDestroy(): void {
    this.personaSubscription.unsubscribe();
    this.selectedPersonaSubscription.unsubscribe();
  }
}

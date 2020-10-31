import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Neo4jService } from '../core/services/neo4j.service';
import { Persona } from '../models';

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit {
  persona: Persona = {} as Persona;

  guidelines = [
    {
      image: 'assets/images/on_focus.png',
      title: 'On Focus',
      subtitle: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      title: 'Error Suggestion',
      subtitle: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      title: 'On Focus',
      subtitle: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      title: 'Error Suggestion',
      subtitle: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      title: 'On Focus',
      subtitle: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      title: 'Error Suggestion',
      subtitle: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      title: 'On Focus',
      subtitle: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      title: 'Error Suggestion',
      subtitle: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      title: 'On Focus',
      subtitle: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      title: 'Error Suggestion',
      subtitle: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },
  ];

  personaSubscription: Subscription;

  constructor(private neo4jService: Neo4jService) {}

  ngOnInit(): void {
    this.personaSubscription = this.neo4jService.selectedPersona$.subscribe(
      (persona) => {
        this.persona = persona;
      }
    );
  }
}

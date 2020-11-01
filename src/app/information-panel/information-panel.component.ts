import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('scrollable') scrollableElementRef: ElementRef<HTMLDivElement>;

  guidelines: Guideline[] = [];

  personaSubscription: Subscription;
  guidelineSubscription: Subscription;

  constructor(private neo4jService: Neo4jService) {}

  ngOnInit(): void {
    this.personaSubscription = this.neo4jService.selectedPersona$.subscribe(
      (persona) => {
        this.scrollableElementRef?.nativeElement?.scrollTo(0, 0);

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

  downloadURI(uri: string): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

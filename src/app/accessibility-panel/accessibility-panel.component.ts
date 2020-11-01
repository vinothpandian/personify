import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Neo4jService } from '../core/services/neo4j.service';
import { AccessibilityType, SearchData, SearchSubTypes } from '../models';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrls: ['./accessibility-panel.component.scss'],
})
export class AccessibilityPanelComponent implements OnInit, OnDestroy {
  searchData: Observable<SearchData>;

  searchTerm = '';
  activeCard = '';

  accessibilities: AccessibilityType[] = [];

  accessibilityTypesSubscription: Subscription;

  constructor(private neo4jService: Neo4jService) {
    this.searchData = this.neo4jService.allNodes$;

    this.accessibilityTypesSubscription = this.neo4jService.accessibilityTypes$.subscribe(
      (accessibilityTypes) => {
        this.accessibilities = accessibilityTypes;
        if (accessibilityTypes.length > 0) {
          this.activeCard = accessibilityTypes[0]?.name;
        }
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.accessibilityTypesSubscription.unsubscribe();
  }

  cardSelected(name: string): void {
    this.activeCard = name;

    this.neo4jService.query(
      `MATCH (n)-[r]-(m) WHERE n.name='${name}' RETURN n,r,m`,
      false
    );
  }

  nodeSelected(model: SearchSubTypes): void {
    if (!model) {
      return;
    }

    const { label, group } = model;

    if (!label) {
      return;
    }

    const updateAll = group === 'Accessibility' ? true : false;

    if (updateAll) {
      this.neo4jService.currentAccessibility.next(label);
    }

    if (label) {
      this.neo4jService.query(
        `MATCH (n)-[r]-(m) WHERE n.name='${label}' RETURN n,r,m`,
        updateAll
      );
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Neo4jService } from '../core/services/neo4j.service';
import { AccessibilityType } from '../models';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrls: ['./accessibility-panel.component.scss'],
})
export class AccessibilityPanelComponent implements OnInit, OnDestroy {
  searchField = new FormControl('');

  activeCard = '';

  accessibilities: AccessibilityType[] = [];

  accessibilityTypesSubscription: Subscription;

  constructor(private neo4jService: Neo4jService) {
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
}

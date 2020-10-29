import { Component, OnInit } from '@angular/core';
import { Neo4jService } from '../core/services/neo4j.service';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss'],
})
export class NavigationPanelComponent implements OnInit {
  selected = 'Visual';

  title = 'Personify';
  links = [
    { name: 'Visual' },
    { name: 'Speech' },
    { name: 'Auditory' },
    { name: 'Motor' },
    { name: 'Cognitive' },
  ];

  constructor(private neo4jService: Neo4jService) {}

  ngOnInit(): void {}

  loadHome(): void {
    this.neo4jService.query('MATCH (n:Main)-[r]-(m) RETURN n,r,m', [
      'title',
      'name',
      'section',
    ]);
  }

  onAccessibilityClick(name: string): void {
    const query = `MATCH (n:Accessibility)-[r]-(m) where n.name='${name}' RETURN n,r,m`;
    this.neo4jService.query(query, ['name']);
    this.selected = name;
  }

  getImageSrc(item: string): string {
    const src = 'assets/icons';

    if (item === this.selected) {
      return `${src}/${item.toLowerCase()}-active.png`;
    }

    return `${src}/${item.toLowerCase()}.png`;
  }
}

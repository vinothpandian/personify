import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}

  getImageSrc(item: string): string {
    const src = 'assets/icons';

    if (item === this.selected) {
      return `${src}/${item.toLowerCase()}-active.png`;
    }

    return `${src}/${item.toLowerCase()}.png`;
  }
}

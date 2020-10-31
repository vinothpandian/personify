import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-accessibility-card',
  templateUrl: './accessibility-card.component.html',
  styleUrls: ['./accessibility-card.component.scss'],
})
export class AccessibilityCardComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() active: string;
  image: string;

  @Input('image') set setImage(url: string) {
    this.image = encodeURI(url);
  }

  constructor() {}

  ngOnInit(): void {}
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-guideline-card',
  templateUrl: './guideline-card.component.html',
  styleUrls: ['./guideline-card.component.scss'],
})
export class GuidelineCardComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() image: string;
  @Input() description: string;

  constructor() {}

  ngOnInit(): void {}
}

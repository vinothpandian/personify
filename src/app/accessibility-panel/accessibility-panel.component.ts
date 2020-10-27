import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrls: ['./accessibility-panel.component.scss'],
})
export class AccessibilityPanelComponent implements OnInit {
  searchField = new FormControl('');

  constructor() {}

  ngOnInit(): void {}
}

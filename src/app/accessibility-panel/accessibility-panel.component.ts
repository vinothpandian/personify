import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrls: ['./accessibility-panel.component.scss'],
})
export class AccessibilityPanelComponent implements OnInit {
  searchField = new FormControl('');

  activeCard = 'Complete Blindness';

  accessibilities = [
    {
      title: 'Complete Blindness',
      description:
        'A completely blind individual is unable to see at all. It refers to the complete lack of form and light perception. It can be temporary or permanent.',
    },
    {
      title: 'Partial Blindness',
      description:
        'Partial Blindness can also be referred as Low Vision. The low visioned people cannot see things clearly. The need assistive tech or tools to have better vision.',
    },
    {
      title: 'Color Blindness',
      description:
        'Color blindness happens when someone cannot distinguish between certain colors such as greens, reds and blues. It is also known as color deficiency. ',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}

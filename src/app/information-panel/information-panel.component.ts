import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit {
  persona = {
    name: 'Ammar',
    profession: 'Music Teacher',
    image: 'assets/images/ammar.png',
    accessibility: 'Complete blindness',
    quote: 'Music is for everyone. Technology is for everyone.',
    description:
      'Ammar is married and has 2 little daughters. He is a music teacher who teaches to play 11 musical instruments. At the age of 13, he went blind.\n He always want to inspire his students through new ways of creating music. He is planning to use podcasts and videos as apart of his online course work for his students. He travels a lot. He likes to listen to podcasts realted to music while traveling.',
    hates:
      'Ammar hates websites that don’t allow him to download the audio version of articles. He dont always stay online in front of his computer.',
  };

  guidelines = [
    {
      image: 'assets/images/on_focus.png',
      name: 'On Focus',
      type: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      name: 'Error Suggestion',
      type: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      name: 'On Focus',
      type: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      name: 'Error Suggestion',
      type: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      name: 'On Focus',
      type: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      name: 'Error Suggestion',
      type: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      name: 'On Focus',
      type: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      name: 'Error Suggestion',
      type: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },

    {
      image: 'assets/images/on_focus.png',
      name: 'On Focus',
      type: 'WCAG 2.1 Predictable',
      description:
        'Any component that is able to trigger an event when it receives focus must not change the cont ext.',
    },
    {
      image: 'assets/images/error.png',
      name: 'Error Suggestion',
      type: 'WCAG 2.1 Input Assistance',
      description:
        'If an input error is detected (via client-side or server-side validation), suggestions are provided for fixing the input.',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}

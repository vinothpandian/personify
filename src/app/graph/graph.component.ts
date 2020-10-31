import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Network, Options } from 'vis-network/standalone';
import { InformationService } from '../core/services/information.service';
import { Neo4jService } from '../core/services/neo4j.service';
import { GraphClickEvent, GraphData, GraphNode } from '../core/typings';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  private network: Network;
  private neo4jSubscription: Subscription;

  constructor(
    private neo4jService: Neo4jService,
    private informationService: InformationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const container = this.visNetwork.nativeElement;

    const options: Options = {
      autoResize: true,
      interaction: {
        navigationButtons: true,
        keyboard: true,
      },
      clickToUse: false,
      nodes: {
        shape: 'circularImage',
        font: {
          size: 12,
        },
        color: { background: '#673ab7', border: 'black' },
      },
      edges: {
        arrows: 'to',
        font: {
          size: 8,
          align: 'middle',
        },
      },
      groups: {
        personas: {
          color: { border: 'green', borderWidth: 3 },
        },
        perceivable: {
          size: 20,
          color: { border: 'red', background: '#FF3633' },
          shape: 'dot',
          font: { size: 16, strokeWidth: 7 },
          value: 3,
        },
        operable: {
          size: 20,
          color: { border: 'green', background: '#60D394' },
          shape: 'dot',
          font: { size: 16, strokeWidth: 7 },
        },
        understandable: {
          size: 20,
          color: { border: 'brown', background: '#ED7D3A' },
          shape: 'dot',
          font: { size: 16, strokeWidth: 7 },
        },
        robust: {
          size: 20,
          color: { border: 'brown', background: '#FFD399' },
          shape: 'dot',
          font: { size: 16, strokeWidth: 7 },
        },
        distinguishable: {
          size: 10,
          color: { border: 'red', background: '#FB7E81' },
          shape: 'square',
          font: { size: 12, strokeWidth: 7 },
        },
        adaptable: {
          size: 10,
          color: { border: 'red', background: '#FB7E81' },
          shape: 'diamond',
          font: { size: 12, strokeWidth: 7 },
        },
        timeBasedMedia: {
          size: 10,
          color: { border: 'red', background: '#FB7E81' },
          shape: 'dot',
          font: { size: 12, strokeWidth: 7 },
        },
        textAlternatives: {
          size: 10,
          color: { border: 'red', background: '#FB7E81' },
          shape: 'triangle',
          font: { size: 12, strokeWidth: 7 },
        },
        guideline: {
          size: 30,
          color: { border: 'black', background: '#C2FABC' },
          shape: 'dot',
          font: { size: 20, strokeWidth: 7 },
        },
        principlesWCAG: {
          size: 40,
          color: { border: 'black', background: '#A23E48' },
          shape: 'dot',
          font: { size: 20 },
        },
        principlesUAAG: {
          size: 40,
          color: { border: 'black', background: '#A23E48' },
          shape: 'dot',
          font: { size: 20 },
        },
        inputModalities: {
          size: 10,
          color: { border: 'green', background: '#AAF683' },
          shape: 'diamond',
          font: { size: 12, strokeWidth: 7 },
        },
        navigable: {
          size: 10,
          color: { border: 'green', background: '#AAF683' },
          shape: 'star',
          font: { size: 12, strokeWidth: 7 },
        },
        enoughTime: {
          size: 10,
          color: { border: 'green', background: '#AAF683' },
          shape: 'square',
          font: { size: 12, strokeWidth: 7 },
        },
        keyboardAccessible: {
          size: 10,
          color: { border: 'green', background: '#AAF683' },
          shape: 'triangle',
          font: { size: 12, strokeWidth: 7 },
        },
        seizuresPhysicalReactions: {
          size: 10,
          color: { border: 'green', background: '#AAF683' },
          shape: 'hexagon',
          font: { size: 12, strokeWidth: 7 },
        },
        predictable: {
          size: 10,
          color: { border: 'brown', background: '#FADAC7' },
          shape: 'hexagon',
          font: { size: 12, strokeWidth: 7 },
        },
        readable: {
          size: 10,
          color: { border: 'brown', background: '#FADAC7' },
          shape: 'star',
          font: { size: 12, strokeWidth: 7 },
        },
        inputAssistance: {
          size: 10,
          color: { border: 'brown', background: '#FADAC7' },
          shape: 'square',
          font: { size: 12, strokeWidth: 7 },
        },
        compatible: {
          size: 10,
          color: { border: 'brown', background: '#FFA630' },
          shape: 'square',
          font: { size: 12, strokeWidth: 7 },
        },
        assistiveTechnology: {
          size: 10,
          color: { border: 'red', background: '#CE1483' },
          shape: 'hexagon',
          font: { size: 12, strokeWidth: 7 },
        },
        programmaticAccess: {
          size: 20,
          color: { border: '#4A072F', background: '#F6A2D4' },
          shape: 'dot',
          font: { size: 12, strokeWidth: 7 },
        },
        specificationsConventions: {
          size: 20,
          color: { border: '#005250', background: '#00CECB' },
          shape: 'dot',
          font: { size: 12, strokeWidth: 7 },
        },
        followSpecifications: {
          size: 10,
          color: { border: '#005250', background: '#ADFFFE' },
          shape: 'star',
          font: { size: 12, strokeWidth: 7 },
        },
      },
      layout: {
        improvedLayout: false,
      },
      physics: {
        stabilization: {
          enabled: false,
        },
        solver: 'repulsion',
      },
    };

    this.network = new Network(container, {}, options);

    this.network.on('selectNode', (event) => {
      this.onNodeSelect(event);
    });

    this.network.on('deselectNode', (event) => {
      this.onNodeDeselect(event);
    });

    this.network.on('doubleClick', (event) => {
      this.onNodeDoubleClicked(event);
    });

    this.network.on('hoverNode', (event) => {
      this.onNodeDoubleClicked(event);
    });

    this.neo4jSubscription = this.neo4jService.$data.subscribe(
      (data: GraphData) => {
        this.network.setData(data);
      }
    );
  }

  private onNodeSelect(event: any): void {
    if (event.nodes.length === 0) {
      return;
    }

    const clickedNodeId = event.nodes[0];

    const node = this.neo4jService.getNodeById(clickedNodeId);

    this.informationService.$information.next(node.label);
  }

  private onNodeDeselect(event: GraphClickEvent): void {
    const length = event?.previousSelection?.nodes.length;

    if (length === 0) {
      return;
    }

    const clickedNode = event.previousSelection.nodes[0] as GraphNode;
    const clickedNodeId = clickedNode.id;

    this.informationService.$information.next('');
  }

  private onNodeDoubleClicked(event: GraphClickEvent): void {
    if (event.nodes.length === 0) {
      return;
    }

    const clickedNodeId = event.nodes[0];

    const node = this.neo4jService.getNodeById(clickedNodeId);

    this.informationService.$information.next(node.label);

    this.neo4jService.query(
      'Match (n)-[r]-(m) where ID(n)=$id return n,r,m',
      ['name', 'section'],
      { id: clickedNodeId }
    );
  }

  ngOnDestroy(): void {
    this.neo4jSubscription.unsubscribe();
    this.network.destroy();
  }
}

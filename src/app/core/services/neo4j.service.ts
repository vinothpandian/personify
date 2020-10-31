import { Injectable, OnDestroy } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccessibilityType, Guideline, Persona } from 'src/app/models';
import { environment } from '../../../environments/environment';
import Parser from '../parser';
import {
  GraphData,
  GraphEdge,
  GraphEdges,
  GraphNode,
  GraphNodes,
  Neo4jConfig,
} from '../typings';

@Injectable({
  providedIn: 'root',
})
export class Neo4jService implements OnDestroy {
  private driver: neo4j.Driver;
  private parser: Parser;

  private nodes: GraphNodes;
  private edges: GraphEdges;
  private config: Neo4jConfig;

  public $ready = new ReplaySubject<string>();
  public $data = new Subject<GraphData>();

  personas$ = new BehaviorSubject<Persona[]>([]);
  private personas = [];
  accessibilityTypes$ = new BehaviorSubject<AccessibilityType[]>([]);
  private accessibilityTypes = [];
  guidelines$ = new BehaviorSubject<Guideline[]>([]);
  private guidelines = [];

  selectedPersona$ = new BehaviorSubject<Persona>({} as Persona);

  constructor() {
    this.config = environment.neo4jConfig;

    this.driver = neo4j.driver(
      this.config.url,
      neo4j.auth.basic(this.config.username, this.config.password)
    );

    this.driver
      .verifyConnectivity()
      .then(() => {
        this.$ready.next('ready');
      })
      .catch((error) => {
        console.error(error);
      });

    this.parser = new Parser();
    this.nodes = {};
    this.edges = {};
  }

  query(
    query: string,
    labels: string[] = ['name', 'section'],
    parameters?: any
  ): void {
    const rxSession = this.driver.rxSession({
      defaultAccessMode: neo4j.session.READ,
    });

    this.nodes = {};
    this.edges = {};
    this.personas = [];
    this.accessibilityTypes = [];
    this.guidelines = [];

    rxSession
      .run(query, parameters)
      .records()
      .pipe(
        map((record: neo4j.Record) => {
          // m in different and must be sorted by different node types
          //  m can be sorted by label
          //  Relationship with FOLLOW_THIS_GUIDELINE --> Guideline
          //  Relationship with HAS_DISABILITY_RELATED_TO --> Persona
          //  Relationship with TYPE --> SubTypes

          const relationship = record.get('r') as neo4j.Relationship;
          const node = record.get('m') as neo4j.Node;

          switch (relationship.type) {
            case 'TYPE':
              const [
                accessibilityNode,
                accessibilityNodeError,
              ] = this.parser.parseAccessibilityType(node);
              if (accessibilityNodeError) {
                break;
              }
              this.accessibilityTypes.push(accessibilityNode);
              break;
            case 'FOLLOW_THIS_GUIDELINE':
              const [
                guidelineNode,
                guidelineNodeError,
              ] = this.parser.parseGuideline(node);
              if (guidelineNodeError) {
                break;
              }
              this.guidelines.push(guidelineNode);
              break;
            case 'HAS_DISABILITY_RELATED_TO':
              const [personaNode, personaNodeError] = this.parser.parsePersona(
                node
              );
              if (personaNodeError) {
                break;
              }
              this.personas.push(personaNode);
              break;
          }

          return this.parser.parse(record, labels);
        })
      )
      .subscribe({
        next: ({ nodes, edges }) => {
          this.nodes = {
            ...this.nodes,
            ...nodes,
          };
          this.edges = {
            ...this.edges,
            ...edges,
          };
        },
        complete: () => {
          this.selectedPersona$.next(this.personas[0]);
          this.personas$.next(this.personas);
          this.accessibilityTypes$.next(this.accessibilityTypes);
          this.guidelines$.next(this.guidelines);

          this.$data.next({
            nodes: Object.values(this.nodes),
            edges: Object.values(this.edges),
          });
        },
      });

    rxSession.close();
  }

  getNodes(): GraphNodes {
    return this.nodes;
  }

  getNodeById(id: number): GraphNode {
    if (id in this.nodes) {
      return this.nodes[id];
    }

    throw RangeError(`Node ${id} not found`);
  }

  getEdges(): GraphEdges {
    return this.edges;
  }

  getEdgeById(id: number): GraphEdge {
    if (id in this.edges) {
      return this.edges[id];
    }

    throw RangeError(`Edge ${id} not found`);
  }

  ngOnDestroy(): void {
    this.driver.close();
    this.$ready.next();
    this.$ready.complete();
    this.$ready.unsubscribe();
  }
}

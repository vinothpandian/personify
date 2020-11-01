import { Injectable, OnDestroy } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  AccessibilityType,
  Guideline,
  Persona,
  SearchData,
} from 'src/app/models';
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

  searchData: {
    [label: string]: string[];
  } = {};
  allNodes$ = new BehaviorSubject<SearchData>([]);

  currentAccessibility = new BehaviorSubject<string>('Speech');

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
    this.personas = [];
    this.accessibilityTypes = [];
    this.guidelines = [];
  }

  getAllNodes(): void {
    const rxSession = this.driver.rxSession({
      defaultAccessMode: neo4j.session.READ,
    });

    this.searchData = {};

    rxSession
      .run('MATCH (n) return n')
      .records()
      .pipe(
        map((record: neo4j.Record) => {
          const node: neo4j.Node = record.get('n');

          // tslint:disable-next-line
          const name = node.properties?.['name'];

          if (name) {
            return [node.labels[0], name];
          }

          return [];
        }),
        filter((data) => data.length === 2)
      )
      .subscribe({
        next: ([label, subtype]) => {
          if (label in this.searchData) {
            this.searchData[label].push(subtype);
          } else {
            this.searchData[label] = [subtype];
          }
        },
        complete: () => {
          const allNodes = Object.entries(this.searchData).map(
            ([label, data]) => ({
              label,
              data: data.map((item) => ({
                label: item,
                group: label,
              })),
            })
          );

          this.allNodes$.next(allNodes);
        },
      });

    rxSession.close();
  }

  updateData(record: neo4j.Record): void {
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
        const [guidelineNode, guidelineNodeError] = this.parser.parseGuideline(
          node
        );
        if (guidelineNodeError) {
          break;
        }
        this.guidelines.push(guidelineNode);
        break;
      case 'HAS_DISABILITY_RELATED_TO':
        const [personaNode, personaNodeError] = this.parser.parsePersona(node);
        if (personaNodeError) {
          break;
        }
        this.personas.push(personaNode);
        break;
    }
  }

  query(
    query: string,
    updateAll: boolean = true,
    labels: string[] = ['name', 'section'],
    parameters?: any
  ): void {
    const rxSession = this.driver.rxSession({
      defaultAccessMode: neo4j.session.READ,
    });

    this.nodes = {};
    this.edges = {};

    if (updateAll) {
      this.personas = [];
      this.accessibilityTypes = [];
      this.guidelines = [];
    }

    rxSession
      .run(query, parameters)
      .records()
      .pipe(
        map((record: neo4j.Record) => {
          if (updateAll) {
            this.updateData(record);
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
          if (updateAll) {
            this.selectedPersona$.next(this.personas[0]);
            this.personas$.next(this.personas);
            this.accessibilityTypes$.next(this.accessibilityTypes);
            this.guidelines$.next(this.guidelines);
          }

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

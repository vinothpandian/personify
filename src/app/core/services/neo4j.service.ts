import { Injectable, OnDestroy } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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

  query(query: string, labels: string[] = [], parameters?: any): void {
    const rxSession = this.driver.rxSession({
      defaultAccessMode: neo4j.session.READ,
    });

    this.nodes = {};
    this.edges = {};

    rxSession
      .run(query, parameters)
      .records()
      .pipe(
        map((record: neo4j.Record) => {
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

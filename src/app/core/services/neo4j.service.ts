import { Injectable, OnDestroy } from '@angular/core';
import { auth, Driver, driver, QueryResult } from 'neo4j-driver';
import { ReplaySubject, Subject } from 'rxjs';
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
  private driver: Driver;
  private parser: Parser;
  private nodes: GraphNodes;
  private edges: GraphEdges;
  private config: Neo4jConfig;

  public $ready = new ReplaySubject<string>();
  public $data = new Subject<GraphData>();

  constructor() {
    this.config = environment.neo4jConfig;

    this.driver = driver(
      this.config.url,
      auth.basic(this.config.username, this.config.password)
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

  async query(query: string, labels: string[] = [], parameters?: any) {
    const session = this.driver.session();

    const queryResult: QueryResult = await session.run(query, parameters);
    const { nodes, edges } = this.parser.parse(queryResult, labels);

    this.nodes = nodes;
    this.edges = edges;

    this.$data.next({
      nodes: Object.values(nodes),
      edges: Object.values(edges),
    });

    session.close();
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

  ngOnDestroy() {
    this.driver.close();
    this.$ready.unsubscribe();
  }
}

import { Edge, Node } from 'vis-network';

export type GraphNode = Node;
export type GraphEdge = Edge;

export interface GraphNodes {
  [key: number]: GraphNode;
}

export interface GraphEdges {
  [key: number]: GraphEdge;
}

export interface Graph {
  nodes: GraphNodes;
  edges: GraphEdges;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Neo4jConfig {
  url: string;
  username: string;
  password: string;
}

export interface GraphClickEvent {
  nodes: number[];
  edges: number[];
  event: Event;
  pointer: {
    DOM: { x: number; y: number };
    canvas: { x: number; y: number };
  };
  items: any[];
  previousSelection?: {
    nodes: number[];
    edges: number[];
  };
}

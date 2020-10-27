import { QueryResult, Record } from 'neo4j-driver';
import {
  isNode,
  isRelationship,
  Node,
  Relationship,
} from 'neo4j-driver/lib/graph-types';
import { Graph, GraphEdge, GraphEdges, GraphNode, GraphNodes } from './typings';

class Parser {
  labels: string[];

  constructor() {
    this.labels = ['name'];
  }

  parseNode(id: number, node: Node): GraphNode {
    const graphNode: GraphNode = {
      id,
      title: 'Double Click to Expand.',
    };

    Object.entries(node.properties).forEach(([key, value]) => {
      graphNode[key] = value.toString();

      if (this.labels.indexOf(key) > -1) {
        graphNode.label = value.toString();
        graphNode.image = `https://designwithpersonify.com/f/nodes/${value}.png`;
      }
    });

    return graphNode;
  }

  parseRelationship(id: number, item: Relationship): GraphEdge {
    return {
      id,
      from: item.start.toInt(),
      to: item.end.toInt(),
      label: item.type,
    };
  }

  parse(queryResult: QueryResult, labels: string[] = []): Graph {
    this.labels = labels.length === 0 ? this.labels : labels;

    const nodes: GraphNodes = {};
    const edges: GraphEdges = {};

    queryResult.records.forEach((record: Record) => {
      Object.values(record.toObject()).forEach((item) => {
        const id = item.identity.toInt();

        if (isNode(item)) {
          if (id in nodes) {
            return;
          }

          nodes[id] = this.parseNode(id, item);
        }

        if (isRelationship(item)) {
          if (id in edges) {
            return;
          }

          edges[id] = this.parseRelationship(id, item);
        }
      });
    });

    return {
      nodes,
      edges,
    };
  }
}

export default Parser;

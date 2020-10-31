import * as neo4j from 'neo4j-driver';
import { isNode, isRelationship } from 'neo4j-driver/lib/graph-types.js';
import { AccessibilityType, DataNodeType, Guideline, Persona } from '../models';
import { Graph, GraphEdge, GraphEdges, GraphNode, GraphNodes } from './typings';

class Parser {
  labels: string[];

  constructor() {
    this.labels = ['name'];
  }

  parseNode(id: number, node: neo4j.Node): GraphNode {
    const graphNode: GraphNode = {
      id,
      title: 'Double Click to Expand.',
    };

    Object.entries(node.properties).forEach(([key, value]) => {
      graphNode[key] = value.toString();
      graphNode.image = 'assets/images/placeholder.jpg';
      graphNode.brokenImage = 'assets/images/placeholder.jpg';

      if (this.labels.includes(key)) {
        graphNode.label = value.toString();
        graphNode.image = encodeURI(
          `https://designwithpersonify.com/f/nodes/${value}.png`
        );
      }
    });

    if ('name' in node.properties) {
      // tslint:disable-next-line
      const name = node.properties['name'].toString();

      const url = encodeURI(
        `https://designwithpersonify.com/f/nodes/${name}.png`
      );

      graphNode.image = url;
    }

    return graphNode;
  }

  parseRelationship(id: number, item: neo4j.Relationship): GraphEdge {
    return {
      id,
      from: item.start.toNumber(),
      to: item.end.toNumber(),
      label: item.type,
    };
  }

  parsePersona(node: neo4j.Node): Persona {
    return {
      ...(node.properties as Persona),
      type: DataNodeType.Persona,
    };
  }

  parseAccessibilityType(node: neo4j.Node): AccessibilityType {
    return {
      ...(node.properties as AccessibilityType),
      type: DataNodeType.AccessibilityType,
    };
  }

  parseGuideline(node: neo4j.Node): Guideline {
    // tslint:disable-next-line
    const guidelineID = node.properties?.['type'] ?? '';

    return {
      ...(node.properties as Guideline),
      type: DataNodeType.Guideline,
      guidelineID,
    };
  }

  parse(record: neo4j.Record, labels: string[] = []): Graph {
    this.labels = labels.length === 0 ? this.labels : labels;

    const nodes: GraphNodes = {};
    const edges: GraphEdges = {};

    record.forEach((item) => {
      const id = item.identity.toNumber();

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

    return {
      nodes,
      edges,
    };
  }
}

export default Parser;

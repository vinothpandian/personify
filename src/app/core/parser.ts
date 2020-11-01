import * as neo4j from 'neo4j-driver';
import { isNode, isRelationship } from 'neo4j-driver/lib/graph-types.js';
import { AccessibilityType, DataNodeType, Guideline, Persona } from '../models';
import { Graph, GraphEdge, GraphEdges, GraphNode, GraphNodes } from './typings';

class Parser {
  labels: string[];
  groups: Set<string>;

  constructor() {
    this.labels = ['name'];

    this.groups = new Set([
      'perceivable',
      'operable',
      'understandable',
      'robust',
      'distinguishable',
      'adaptable',
      'timeBasedMedia',
      'textAlternatives',
      'guideline',
      'principlesWCAG',
      'principlesUAAG',
      'inputModalities',
      'navigable',
      'enoughTime',
      'keyboardAccessible',
      'seizuresPhysicalReactions',
      'predictable',
      'readable',
      'inputAssistance',
      'compatible',
      'assistiveTechnology',
      'programmaticAccess',
      'specificationsConventions',
      'followSpecifications',
    ]);
  }

  parseNode(id: number, node: neo4j.Node): GraphNode {
    const graphNode: GraphNode = {
      id,
      title: 'Double Click to Expand.',
    };

    Object.entries(node.properties).forEach(([key, value]) => {
      graphNode[key] = value.toString();

      if (key === 'name' || key === 'section') {
        graphNode.label = value.toString();

        // tslint:disable-next-line
        const group = node.properties?.['group'] ?? 'persona';

        if (!this.groups.has(group)) {
          graphNode.image = encodeURI(
            `https://designwithpersonify.com/f/nodes/${value.toString()}.png`
          );
          graphNode.brokenImage = 'assets/images/placeholder.jpg';
        }
      }
    });

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

  getPersonaURL(name: string): string {
    return encodeURI(
      `https://designwithpersonify.com/f/persona_photos/${name}.png`
    );
  }

  parsePersona(node: neo4j.Node): [Persona, boolean] {
    const personaNode = node.properties as Persona;
    const hasName = personaNode?.name ?? false;
    const hasBiography = personaNode?.biography ?? false;

    if (!(hasName && hasBiography)) {
      return [{} as Persona, true];
    }

    return [
      {
        ...(node.properties as Persona),
        type: DataNodeType.Persona,
        image: this.getPersonaURL(personaNode.name),
      },
      false,
    ];
  }

  parseAccessibilityType(node: neo4j.Node): [AccessibilityType, boolean] {
    const accessibilityTypeNode = node.properties as AccessibilityType;
    const hasName = accessibilityTypeNode?.name ?? false;
    const hasdescription = accessibilityTypeNode?.description ?? false;

    if (!(hasName && hasdescription)) {
      return [{} as AccessibilityType, true];
    }

    return [
      {
        ...(node.properties as AccessibilityType),
        type: DataNodeType.AccessibilityType,
      },
      false,
    ];
  }

  parseGuideline(node: neo4j.Node): [Guideline, boolean] {
    const guidelineNode = node.properties as Guideline;
    const hasName = guidelineNode?.name ?? false;
    const hasGuidelineType = guidelineNode?.guidelineType ?? false;
    const hasLevel = guidelineNode?.level ?? false;

    if (!(hasName && hasGuidelineType && hasLevel)) {
      return [{} as Guideline, true];
    }

    // tslint:disable-next-line
    const guidelineID = node.properties?.['type'] ?? '';

    return [
      {
        ...(node.properties as Guideline),
        type: DataNodeType.Guideline,
        guidelineID,
      },
      false,
    ];
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

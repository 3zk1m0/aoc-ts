import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput
  .trim()
  .split('\n')
  .map(line => line.split('-')) as Connection[]

type Connection = [string, string]

function buildGraph(connections: Connection[]) {
  const graph = new Map<string, Set<string>>();

  for (const [a, b] of connections) {
    if (!graph.has(a)) graph.set(a, new Set());
    if (!graph.has(b)) graph.set(b, new Set());
    graph.get(a)!.add(b);
    graph.get(b)!.add(a);
  }

  return graph
}


const part1 = (input: Input) => {
  const graph = buildGraph(input)

  const triangles = new Set<string>();

  for (const [a, neighbors] of graph) {
    for (const b of neighbors) {
      if (b === a) continue;
      for (const c of neighbors) {
        if (c === b) continue
        if (!graph.get(b)!.has(c)) continue;
        const triangle = [a, b, c].sort()
        if (!triangle.some(name => name.startsWith('t'))) continue
        triangles.add(triangle.join(","));
      }
    }
  }

  return triangles.size
}

const part2 = (input: Input) => {
  const graph = buildGraph(input)

  const cliques: string[][] = [];

  const backtrack = (potentialClique: Set<string>, remainingNodes: Set<string>, skipNodes: Set<string>) => {
    if (remainingNodes.size === 0 && skipNodes.size === 0) {
      cliques.push([...potentialClique]);
      return;
    }

    for (const node of remainingNodes) {
      potentialClique.add(node);

      const newRemaining = new Set(
        [...remainingNodes].filter(neighbor => graph.get(node)!.has(neighbor))
      );
      const newSkip = new Set(
        [...skipNodes].filter(neighbor => graph.get(node)!.has(neighbor))
      );

      backtrack(potentialClique, newRemaining, newSkip);

      potentialClique.delete(node);
      remainingNodes.delete(node);
      skipNodes.add(node);
    }
  }

  backtrack(new Set(), new Set(graph.keys()), new Set());

  return cliques
    .reduce((acc, clique) => clique.length > acc.length ? clique : acc, [])
    .sort()
    .join(',')

}

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}

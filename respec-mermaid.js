import mermaid  from 'mermaid'

 async function renderMermaid(){
  mermaid.initialize({ startOnLoad: true });
  await mermaid.run({
    querySelector: '.respec-mermaid',
  });
}

export default renderMermaid;


let nodeCount = 0;

const getNodeId = ()=>{
  return nodeCount++;
}

const addEdge = (source, label, target, graph)=>{
  const e = {
    source: source,
    label: label,
    target: target,
  }
  if (e.source !== e.target){
    graph.edges.push(e)
  }
  return e;
}

const addNode = (label, graph)=>{
  const n = {
    id: getNodeId(),
    label: label,
  }
  graph.nodes[n.id] = n;
  return n;
}

const objectToGraph = (item, graph, parent) => {
  if (typeof item === 'object' && !Array.isArray(item)){
    let n = parent
    if (parent){
      addEdge(parent.id, '', n.id, graph)
    } else {
      let type = Array.isArray(item.type) ? item.type[0]: item.type
      n = addNode(type, graph)
    }
    for (const key of Object.keys(item)){
      const value = item[key];
      if (['@context'].includes(key) ){
        continue
      } else {
        if (Array.isArray(value)){
          value.forEach((v) => {
            if (v !== 'VerifiableCredential' && v !== 'VerifiablePresentation'){
              const n2 = addNode(key, graph)
              addEdge(n.id, '', n2.id, graph)
              objectToGraph(v, graph, n2)
            }
          })
        } else {
          // if (['id'].includes(key)){
          //   const n2 = addNode(value, graph)
          //   addEdge(n.id, 'id', n2.id, graph)
          // } else {
          // }
          const n2 = addNode(key, graph)
          addEdge(n.id, '', n2.id, graph)
          objectToGraph(value, graph, n2)
         
        }
      }
    }
  } else {
    const n = addNode(item, graph)
    addEdge(parent.id, '', n.id, graph)
  }
  return graph
}

export const jsonToMermaid = (obj) => {
  const nodes = {}
  const edges = []
  const graph = objectToGraph(obj, { nodes, edges }, null);
  graph.nodes = Object.values(graph.nodes)
  const diagram = `
graph LR

${graph.nodes.map((n)=>{
    let node = `("${n.label}")`
    if (n.label === 'id'){
      node = `{{"${n.label}"}}`
    }
    if (n.label === 'type'){
      node = `(("${n.label}"))`
    }
    return `${n.id}${node}`
  }).join('\n')}

${graph.edges.map((e)=>{
    const sn = nodes[e.source]
    const tn = nodes[e.target]
    let edge = `---`
    if (['id'].includes(tn.label)){
      edge = `---`
    }
    if (['type'].includes(tn.label)){
      edge = `---`
    }
    if (['id'].includes(sn.label)){
      edge = `---`
    }
    return `${e.source} ${edge} ${e.target}`
  }).join('\n')}

`
  // console.log(diagram)
  return diagram
}


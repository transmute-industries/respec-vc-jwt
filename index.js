import * as jose from 'jose';
import mermaid  from 'mermaid'



// transform the input credential to a JWT
async function issueVerifiableCredential({credential, kid, jwk}) {
  const header = {alg: 'ES384', typ: 'vc+ld+jwt', iss: 'did:example:123', kid, cty: 'vc+ld+json'};
  const payload = credential;
  // create the JWT description
  let description = '---------------- Decoded Protected Header ---------------\n' +
    JSON.stringify(header, null, 2);
  description += '\n\n--------------- Decoded Claimset ---------------\n' +
    JSON.stringify(payload, null, 2);
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader(header)
    .sign(jwk.privateKey);
  return description + '\n\n--------------- Compact Encoded JSON Web Token ---------------\n\n' + jwt;
};

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
      n = addNode('Verifiable Credential', graph)
    }
    for (const key of Object.keys(item)){
      const value = item[key];
      if (['@context'].includes(key) ){
        continue
      } else {
        if (Array.isArray(value)){
          value.forEach((v) => {
            if (v !== 'VerifiableCredential'){
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

const jsonToMermaid = (obj) => {
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
  console.log(diagram)
  return diagram
}

function addVcExampleStyles() {
  const exampleStyles = document.createElement('style');

  exampleStyles.innerHTML += `

  .mermaid {
    height: 512px;
    width: 100%;
  }
  .vc-tabbed {
    overflow-x: hidden;
    margin: 0 0;
  }

  .vc-tabbed [type="radio"] {
    display: none;
  }

  .vc-tabs {
    display: flex;
    align-items: stretch;
    list-style: none;
    padding: 0;
    border-bottom: 1px solid #ccc;
  }

  li.vc-tab {
    margin: unset;
    margin-left: 8px;
  }

  .vc-tab > label {
    display: block;
    margin-bottom: -1px;
    padding: .4em .5em;
    border: 1px solid #ccc;
    border-top-right-radius: .4em;
    border-top-left-radius: .4em;
    background: #eee;
    color: #666;
    cursor: pointer;	
    transition: all 0.3s;
  }
  .vc-tab:hover label {
    border-left-color: #333;
    border-top-color: #333;
    border-right-color: #333;
    color: #333;
  }
  
  .vc-tab-content {
    display: none;
  }

  .vc-tabbed [type="radio"]:nth-of-type(1):checked ~ .vc-tabs .vc-tab:nth-of-type(1) label,
  .vc-tabbed [type="radio"]:nth-of-type(2):checked ~ .vc-tabs .vc-tab:nth-of-type(2) label,
  .vc-tabbed [type="radio"]:nth-of-type(3):checked ~ .vc-tabs .vc-tab:nth-of-type(3) label {
    border-bottom-color: #fff;
    background: #fff;
    color: #222;
  }
  
  .vc-tabbed [type="radio"]:nth-of-type(1):checked ~ .vc-tab-content:nth-of-type(1),
  .vc-tabbed [type="radio"]:nth-of-type(2):checked ~ .vc-tab-content:nth-of-type(2),
  .vc-tabbed [type="radio"]:nth-of-type(3):checked ~ .vc-tab-content:nth-of-type(3) {
    display: block;
  }`;

  document.getElementsByTagName('head')[0].appendChild(exampleStyles);
}

async function renderMermaid(){
  await mermaid.run({
    querySelector: '.respec-mermaid',
  });
}

async function createVcExamples() {

  mermaid.initialize({ startOnLoad: true });

  const jwk = await jose.generateKeyPair('ES384');

  // add styles for examples
  addVcExampleStyles();
  
  // process every example that needs a vc-proof
  const vcProofExamples = document.querySelectorAll(".vc-jwt");
  let exampleCount = 0;
  for(const example of vcProofExamples) {
    exampleCount++;
    const kid = example.getAttribute('data-vc-kid');
    let credential = {};
    try {
      let exampleText = example.innerText;
      exampleText = exampleText.replace(/\/\/ .*$/gm, '');
      credential = JSON.parse(exampleText);
    } catch(e) {
      console.error('respec-vc error: Failed to create Verifiable Credential.',
        e, example.innerText);
      continue;
    }

    // convert to a JWT
    let jwt;
    try {
      jwt = await issueVerifiableCredential({
        credential, kid: kid || '#0', jwk});
    } catch(e) {
      console.error(
        'respec-vc error: Failed to convert Credential to JWT.',
        e, example.innerText);
      continue;
    }

    // set up the tabbed content
    const tabbedContent = document.createElement('div');
    tabbedContent.setAttribute('class', 'vc-tabbed');

    // set up the claimset button
    const claimsetBtn = document.createElement('input');
    claimsetBtn.setAttribute('type', 'radio');
    claimsetBtn.setAttribute('id', `vc-tab${exampleCount}1`);
    claimsetBtn.setAttribute('name', `vc-tabs${exampleCount}`);
    claimsetBtn.setAttribute('checked', 'checked');
    tabbedContent.appendChild(claimsetBtn);
    

    // set up the vc button
    const verifiableCredentialBtn = document.createElement('input');
    verifiableCredentialBtn.setAttribute('type', 'radio');
    verifiableCredentialBtn.setAttribute('id', `vc-tab${exampleCount}2`);
    verifiableCredentialBtn.setAttribute('name', `vc-tabs${exampleCount}`);
    tabbedContent.appendChild(verifiableCredentialBtn);

    // set up the vc button
    const visualizeBtn = document.createElement('input');
    visualizeBtn.setAttribute('type', 'radio');
    visualizeBtn.setAttribute('id', `vc-tab${exampleCount}3`);
    visualizeBtn.setAttribute('name', `vc-tabs${exampleCount}`);
    visualizeBtn.addEventListener("click", renderMermaid);
    tabbedContent.appendChild(visualizeBtn);

    // set up the tab labels
    const tabLabels = document.createElement("ul");
    tabLabels.setAttribute('class', 'vc-tabs');
    tabbedContent.appendChild(tabLabels);

    const claimsetLabel = document.createElement("li");
    claimsetLabel.setAttribute('class', 'vc-tab');
    claimsetLabel.innerHTML = `<label for='${claimsetBtn.getAttribute('id')}'>Claimset</label>`;
    tabLabels.appendChild(claimsetLabel)

    const verifiableCredentialLabel = document.createElement("li");
    verifiableCredentialLabel.setAttribute('class', 'vc-tab');
    verifiableCredentialLabel.innerHTML = `<label for='${verifiableCredentialBtn.getAttribute('id')}'>Verifiable Credential</label>`;
    tabLabels.appendChild(verifiableCredentialLabel)

    const visualizeLabel = document.createElement("li");
    visualizeLabel.setAttribute('class', 'vc-tab');
    visualizeLabel.innerHTML = `<label for='${visualizeBtn.getAttribute('id')}'>Graph</label>`;
    tabLabels.appendChild(visualizeLabel)

    // append the tabbed content
    const container = example.parentNode;
    const unsignedContent = document.createElement('div');
    unsignedContent.setAttribute('class', 'vc-tab-content');

    // Move the credential example to the unsigned tab
    unsignedContent.append(example);
    tabbedContent.appendChild(unsignedContent);

    const verifiableCredential = document.createElement('div');
    verifiableCredential.setAttribute('class', 'vc-tab-content');
    verifiableCredential.innerHTML = `<pre>${jwt.match(/.{1,75}/g).join('\n')}</pre>`;
    tabbedContent.appendChild(verifiableCredential);

    const visualize = document.createElement('div');
    visualize.setAttribute('class', 'vc-tab-content');
    visualize.innerHTML = `<code class="respec-mermaid">${jsonToMermaid(credential)}</code>`;
    tabbedContent.appendChild(visualize);

    // replace the original example with the tabbed content
    container.append(tabbedContent);

  }
}

// setup exports on window
window.respecVc = {
  createVcExamples
}

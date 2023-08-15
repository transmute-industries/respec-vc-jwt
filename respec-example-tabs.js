import renderMermaid, { jsonToMermaid } from './respec-mermaid'

import { issue } from './issue'

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

const renderRespecExampleTabs = async (examples) =>{
   // await renderMermaid()
    // add styles for examples
    addVcExampleStyles();
    let exampleCount = 0;
  for(const example of examples) {
    exampleCount++;
    const alg = example.getAttribute('data-vp-alg') || 'ES384';
    const kid = example.getAttribute('data-vc-kid') || '#0';

    let header = { alg, kid };
    let claimset = {};
    try {
      let exampleText = example.innerText;
      exampleText = exampleText.replace(/\/\/ .*$/gm, '');
      claimset = JSON.parse(exampleText);
    } catch(e) {
      console.info(e);
      continue;
    }

    // convert to a JWT
    let jwt;
    try {
      jwt = await issue(header, claimset);
    } catch(e) {
      console.info(e);
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
    visualize.innerHTML = `<code class="respec-mermaid">${jsonToMermaid(claimset)}</code>`;
    tabbedContent.appendChild(visualize);

    // replace the original example with the tabbed content
    container.append(tabbedContent);

  }
}

export default renderRespecExampleTabs
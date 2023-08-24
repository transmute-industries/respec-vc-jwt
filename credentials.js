
import { renderMermaid } from './mermaid'
import { credentialExample } from './produce'

const renderRespecCredentialExampleTabs = async (examples) =>{

  for(const index in examples) {
    const example = examples[index]
    if (!example.innerText){
      continue
    }
    let mediaTypes;
    try {
      const header = JSON.parse(JSON.stringify({
        alg: example.getAttribute('data-alg') || 'ES384',
        kid: example.getAttribute('data-kid') || undefined,
        typ: example.getAttribute('data-typ') || undefined,
        cty: example.getAttribute('data-cty') || undefined
      }))
      const json = example.innerText.replace(/\/\/ .*$/gm, '');
      mediaTypes = await credentialExample(header, JSON.parse(json));
    } catch(e) {
      console.info(e);
      continue;
    }

    const container = example.parentNode;
    
    const tabs = document.createElement('div');
    tabs.setAttribute('class', 'vc-tabbed');

    const button1 = document.createElement('input');
    button1.setAttribute('type', 'radio');
    button1.setAttribute('id', `vc-tab-${index}-1`);
    button1.setAttribute('name', `vc-tabs-${index}`);
    button1.setAttribute('checked', 'checked');
    tabs.appendChild(button1);
    
    const button2 = document.createElement('input');
    button2.setAttribute('type', 'radio');
    button2.setAttribute('id', `vc-tab-${index}-2`);
    button2.setAttribute('name', `vc-tabs-${index}`);
    button2.addEventListener("click", () => { 
      const item = document.getElementById(`vc-tab-content-mermaid-${index}`)
      item.innerHTML = `<code class="respec-mermaid">${mediaTypes['text/vnd.mermaid']}</code><pre>${mediaTypes['text/vnd.mermaid']}</pre>`
      renderMermaid();
    });
    tabs.appendChild(button2);

    // const button3 = document.createElement('input');
    // button3.setAttribute('type', 'radio');
    // button3.setAttribute('id', `vc-tab-${index}-3`);
    // button3.setAttribute('name', `vc-tabs-${index}`);
    // tabs.appendChild(button3);

    const button4 = document.createElement('input');
    button4.setAttribute('type', 'radio');
    button4.setAttribute('id', `vc-tab-${index}-4`);
    button4.setAttribute('name', `vc-tabs-${index}`);
    tabs.appendChild(button4);

    const labels = document.createElement("ul");
    labels.setAttribute('class', 'vc-tabs');
    tabs.appendChild(labels);

    const label1 = document.createElement("li");
    label1.setAttribute('class', 'vc-tab');
    label1.innerHTML = `<label for='${button1.getAttribute('id')}'>application/vc+ld+json</label>`;
    labels.appendChild(label1)

    const label2 = document.createElement("li");
    label2.setAttribute('class', 'vc-tab');
    label2.innerHTML = `<label for='${button2.getAttribute('id')}'>text/vnd.mermaid</label>`;
    labels.appendChild(label2)

    // const label3 = document.createElement("li");
    // label3.setAttribute('class', 'vc-tab');
    // label3.innerHTML = `<label for='${button3.getAttribute('id')}'>application/vc+ld+json+jwt</label>`;
    // labels.appendChild(label3)

    const label4 = document.createElement("li");
    label4.setAttribute('class', 'vc-tab');
    label4.innerHTML = `<label for='${button4.getAttribute('id')}'>application/vc+ld+json+sd-jwt</label>`;
    labels.appendChild(label4)

    const content1 = document.createElement('div');
    content1.setAttribute('class', 'vc-tab-content');
    content1.append(example);
    tabs.appendChild(content1);

    const content2 = document.createElement('div');
    content2.setAttribute('class', 'vc-tab-content');
    content2.setAttribute('id', `vc-tab-content-mermaid-${index}`);
    content2.innerHTML = `<code class="respec-mermaid">${mediaTypes['text/vnd.mermaid']}</code>`;
    tabs.appendChild(content2);

    // const content3 = document.createElement('div');
    // content3.setAttribute('class', 'vc-tab-content');
    // content3.innerHTML = `<pre>${mediaTypes['application/vc+ld+json+jwt']}</pre>`;
    // tabs.appendChild(content3);

    const content4 = document.createElement('div');
    content4.setAttribute('class', 'vc-tab-content');
    content4.innerHTML = `<pre>${mediaTypes['application/vc+ld+json+sd-jwt']}</pre>`;
    tabs.appendChild(content4);

    container.append(tabs);

  }
}

export default renderRespecCredentialExampleTabs
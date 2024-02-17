
import {getHtml} from './src/getHtml';

import { getPrivateKey } from './src/exampleKey';
import { getCoseExample } from './src/exampleCose';
import { getJwtExample } from './src/exampleJwt';

async function processVcJoseCose() {
    // add styling for examples
    addVcJoseStyles();
    const examples = Array.from(document.querySelectorAll(".vc-jose-cose")).filter((e) => !!e.innerText)
    for (const index in examples) {
        const example = examples[index]
        const json = JSON.parse(example.innerText.replace(/\/\/ .*$/gm, ''))
        const processedData = await processExample(index, json);
        example.outerHTML = processedData.html
    }
}

function addVcJoseStyles() {
    const styles = document.createElement('style');

    styles.innerHTML += `
  .vc-jose-cose-tabbed {
    overflow-x: hidden;
    margin: 0 0;
  }
  
  .vc-jose-cose-tabbed [type="radio"] {
    display: none;
  }
  
  .vc-jose-cose-tabs {
    display: flex;
    align-items: stretch;
    list-style: none;
    padding: 0;
    border-bottom: 1px solid #ccc;
  }
  
  li.vc-jose-cose-tab {
    margin: unset;
    margin-left: 8px;
  }
  
  .vc-jose-cose-tab>label {
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
  
  .vc-jose-cose-tab:hover label {
    border-left-color: #333;
    border-top-color: #333;
    border-right-color: #333;
    color: #333;
  }
  
  .vc-jose-cose-tab-content {
    display: none;
  }
  
  .vc-jose-cose-tabbed [type="radio"]:nth-of-type(1):checked~.vc-jose-cose-tabs .vc-jose-cose-tab:nth-of-type(1) label,
  .vc-jose-cose-tabbed [type="radio"]:nth-of-type(2):checked~.vc-jose-cose-tabs .vc-jose-cose-tab:nth-of-type(2) label,
  .vc-jose-cose-tabbed [type="radio"]:nth-of-type(3):checked~.vc-jose-cose-tabs .vc-jose-cose-tab:nth-of-type(3) label {
    border-bottom-color: #fff;
    background: #fff;
    color: #222;
  }
  
  .vc-jose-cose-tabbed [type="radio"]:nth-of-type(1):checked~.vc-jose-cose-tab-content:nth-of-type(1),
  .vc-jose-cose-tabbed [type="radio"]:nth-of-type(2):checked~.vc-jose-cose-tab-content:nth-of-type(2),
  .vc-jose-cose-tabbed [type="radio"]:nth-of-type(3):checked~.vc-jose-cose-tab-content:nth-of-type(3) {
    display: block;
  }
  
  .sd-jwt-header {
    color: red
  }
  .sd-jwt-payload {
    color: green
  }
  
  .sd-jwt-payload-verified{
    color: purple
  }
  
  .sd-jwt-signature {
    color: blue
  }
  
  .sd-jwt-disclosure {
    color: purple
  }
  
  .sd-jwt-compact {
    background-color: rgba(0,0,0,.03);
  }`;

    document.head.appendChild(styles);
}

export async function processExample(index, json) {
    const privateKey = await getPrivateKey()
    const coseExample = await getCoseExample(privateKey, json)
    const jwtExample = await getJwtExample(privateKey, json)
    const html = getHtml({index, coseExample, jwtExample});
    return {html};
}

window.respecVcJoseCose = {
    processVcJoseCose
}

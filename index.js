
import mermaid from 'mermaid';

import renderRespecPresentationExampleTabs from './presentations'

import { addExampleStyles } from './styles'

async function createVcExamples() {
  mermaid.init()
  
  // add styles for examples
  addExampleStyles();
  // process every example that needs a vc-proof
  // const credentialExamples = document.querySelectorAll(".vc-jwt");
  // await renderRespecCredentialExampleTabs(credentialExamples)

  const presentationExamples = document.querySelectorAll(".vc-jose-cose-vp-example");
  await renderRespecPresentationExampleTabs(presentationExamples)

}

// setup exports on window
window.respecVc = {
  createVcExamples
}

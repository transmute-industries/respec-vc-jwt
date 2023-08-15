
import mermaid from 'mermaid';

import renderRespecCredentialExampleTabs from './credentials'
import renderRespecPresentationExampleTabs from './presentations'

import { addExampleStyles } from './styles'

async function createVcExamples() {
  mermaid.init()
  
  addExampleStyles();

  const credentialExamples = document.querySelectorAll(".vc-jose-cose-vc-example");
  await renderRespecCredentialExampleTabs(credentialExamples)

  const presentationExamples = document.querySelectorAll(".vc-jose-cose-vp-example");
  await renderRespecPresentationExampleTabs(presentationExamples)

}

window.respecVc = {
  createVcExamples
}


import renderRespecExampleTabs from './respec-example-tabs'

async function createVcExamples() {
  // process every example that needs a vc-proof
  const examples = document.querySelectorAll(".vc-jwt");
  await renderRespecExampleTabs(examples)
}

// setup exports on window
window.respecVc = {
  createVcExamples
}

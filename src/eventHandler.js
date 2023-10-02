
import SD from '@transmute/vc-jwt-sd'

import { getExampleMetadata, generateIssuerClaims, generateHolderDisclosure, issueAndVerifyWithSdJWt } from './sd-jwt'

import { getHtml } from './getHtml'

export const eventHandler =  async function(e) {
  const { index, alg, json } = e.data.payload
  const credentialMetadata = await getExampleMetadata({ alg, json })
  const claims = generateIssuerClaims(json);
  const disclosure = generateHolderDisclosure(json);
  const { vc, vp, verified } = await issueAndVerifyWithSdJWt({ ...credentialMetadata, claims: SD.YAML.load(claims), disclosure: SD.YAML.load(disclosure)});
  const html = getHtml({ index, vc, vp, verified, claims, disclosure })
  const response = { type: 'urn:w3c:respec:example:render', html }
  postMessage(response);
}
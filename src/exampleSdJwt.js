

import yaml from 'yaml'
// import moment from 'moment';
import { issuer, holder, text, key } from "@transmute/verifiable-credentials"; 

import * as jose from 'jose'


export const generateIssuerClaims = (example)=> {
  const generatedClaimsYaml = yaml.stringify(example).replace(/id\: /g, '!sd id: ').replace(/type\:/g, '!sd type:')
  return generatedClaimsYaml
}

export const generateHolderDisclosure = (example) => {
  const claims = generateIssuerClaims(example)
  // redact nested ideas at depth 2 (spaces)
  const edited1 = claims.replace(/  !sd id\:(.*?)\n/g, `  id: False\n`)
  // disclose types
  const edited2 = edited1.replace(/\!sd type\:/g, `type:`)
  // redact remaining ids
  const edited3 = edited2.replace(/\!sd id\:/g, `id:`)
  return edited3
}



const getSdHtml = (vc) =>{
  const [token, ...disclosure] = vc.split('~');
  const [header, payload, signature] = token.split('.');
  const disclosures = disclosure.map((d)=>{
    return `~<span class="sd-jwt-disclosure">${d}</span>`
  }).join('')
  return `
<div class="sd-jwt-compact"><span class="sd-jwt-header">${header}</span>.<span class="sd-jwt-payload">${payload}</span>.<span class="sd-jwt-signature">${signature}</span>${disclosures}</div>`
}

const getVerifiedHtml = (verified)=> {
return `<div>
  <pre class="sd-jwt-header">
// disclosed protected header
${JSON.stringify(verified.protectedHeader, null, 2).trim()}</pre>
  <pre class="sd-jwt-payload-verified">
// disclosed protected claimset
${JSON.stringify(verified.claimset, null, 2).trim()}</pre>
</div>
`
}

const getDisclosabilityHtml = (claims)=> {
  return `<pre>
${claims.trim().replace(/\!sd/g, `<span class="sd-jwt-disclosure">!sd</span>`)}
  </pre>`
  }

const getDisclosuresHtml = (disclosure)=> {
  return `<pre>${disclosure.trim().replace(/False/g, `<span class="sd-jwt-disclosure">False</span>`)}</pre>`
  }

const getCredential = async (privateKey, byteSigner, messageType, messageJson) => {
  const message = await issuer({
    alg: privateKey.alg,
    type: messageType,
    signer: byteSigner
  }).issue({
    claimset: new TextEncoder().encode(generateIssuerClaims(messageJson)) 
  })
  return message;
}

const getPresentation = async (privateKey, byteSigner, messageType, messageJson) => {
  const credential = await getCredential(privateKey, byteSigner, 'application/vc+ld+json+sd-jwt', messageJson)
  // since examples are always enveloped, and truncated, we never actually process key binding or disclosures
  return credential
}

const getBinaryMessage = async (privateKey, messageType, messageJson) =>{
  const byteSigner = {
    sign: async (bytes) => {
      const jws = await new jose.CompactSign(
        bytes
      )
        .setProtectedHeader({ kid: privateKey.kid, alg: privateKey.alg })
        .sign(await key.importKeyLike({
          type: 'application/jwk+json',
          content: new TextEncoder().encode(JSON.stringify(privateKey))
        }))
      return text.encoder.encode(jws)
    }
  }
  switch(messageType){
    case 'application/vc+ld+json+sd-jwt': {
      return getCredential(privateKey, byteSigner, messageType, messageJson)
    }
    case 'application/vp+ld+json+sd-jwt': {
      return getPresentation(privateKey, byteSigner, messageType, messageJson)
    }
    default: {
      throw new Error('Unknown message type')
    }
  }
}

export const getSdJwtExample = async (privateKey, messageJson) => {
  const type = Array.isArray(messageJson.type) ? messageJson.type : [messageJson.type]
  const messageType = type.includes('VerifiableCredential') ? 'application/vc+ld+json+sd-jwt' : 'application/vp+ld+json+sd-jwt'
  const message = await getBinaryMessage(privateKey, messageType, messageJson)
  const messageEncoded = new TextDecoder().decode(message)
  const decodedHeader = jose.decodeProtectedHeader(messageEncoded.split('~')[0])
  const issuerClaims = generateIssuerClaims(messageJson)
  const messageType2 = 'application/ld+yaml'
  return `
// ${messageType2}
<pre>
${issuerClaims}
</pre>
// Protected Header
<pre>
${JSON.stringify(decodedHeader, null, 2)}
</pre>
// ${messageType}
<pre>
${messageEncoded}
</pre>
  `.trim()
}
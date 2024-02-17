
import * as cose from '@transmute/cose'
import { issuer, holder } from "@transmute/verifiable-credentials"; 

import { base64url } from 'jose';

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

const getCredential = async (privateKey, byteSigner, messageType, messageJson) => {
  const message = await issuer({
    alg: privateKey.alg,
    type: messageType,
    signer: byteSigner
  }).issue({
    claimset: new TextEncoder().encode(JSON.stringify(messageJson, null, 2))
  })
  return message;
}

const getPresentation = async (privateKey, byteSigner, messageType, messageJson) => {
  const disclosures = (messageJson.verifiableCredential || []).map((enveloped)=>{
    const { id } = enveloped
    const type = id.includes('base64url') ? id.split(';base64url,')[0].replace('data:', '') :id.split(';')[0].replace('data:', '')
    const content = id.includes('base64url') ? new TextEncoder().encode(id.split('base64url,').pop()) : new TextEncoder().encode(id.split(';').pop())
    return {
      type,
      credential: content
    }
  })
  const message = await holder({
    alg: privateKey.alg,
    type: messageType,
  }).issue({
    signer: byteSigner,
    presentation: messageJson,
    disclosures: disclosures
  })
  return message;
}

const getBinaryMessage = async (privateKey, messageType, messageJson) =>{
  const signer = cose.detached.signer({
    remote: cose.crypto.signer({
      secretKeyJwk: privateKey
    })
  })
  const byteSigner = {
      sign: async (payload)=>{
        return signer.sign({
          protectedHeader: new Map([[1, -7]]),
          unprotectedHeader: new Map(),
          payload
        })
    }
  }
  switch(messageType){
    case 'application/vc+ld+json+cose': {
      return getCredential(privateKey, byteSigner, messageType, messageJson)
    }
    case 'application/vp+ld+json+cose': {
      return getPresentation(privateKey, byteSigner, messageType, messageJson)
    }
    default: {
      throw new Error('Unknown message type')
    }
  }
}

export const getCoseExample = async (privateKey, messageJson) => {
  const type = Array.isArray(messageJson.type) ? messageJson.type : [messageJson.type]
  const messageType = type.includes('VerifiableCredential') ? 'application/vc+ld+json+cose' : 'application/vp+ld+json+cose'
  const message = await getBinaryMessage(privateKey, messageType, messageJson)
  const messageHex = buf2hex(message)
  const messageDiag = await cose.cbor.diagnose(message)
  return `
// ${messageType.replace('+cose', '')}
<pre>
${JSON.stringify(messageJson, null, 2)}
</pre>
// ${messageType} (detached payload)
<pre>
${messageHex}
</pre>
// application/cbor-diagnostic
<pre>
${messageDiag.trim()}
</pre>

  `
}
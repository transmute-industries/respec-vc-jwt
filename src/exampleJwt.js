

import { issuer, holder, text, key } from "@transmute/verifiable-credentials"; 

import * as jose from 'jose'

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
    case 'application/vc+ld+json+jwt': {
      return getCredential(privateKey, byteSigner, messageType, messageJson)
    }
    case 'application/vp+ld+json+jwt': {
      return getPresentation(privateKey, byteSigner, messageType, messageJson)
    }
    default: {
      throw new Error('Unknown message type')
    }
  }
}

export const getJwtExample = async (privateKey, messageJson) => {
  const type = Array.isArray(messageJson.type) ? messageJson.type : [messageJson.type]
  const messageType = type.includes('VerifiableCredential') ? 'application/vc+ld+json+jwt' : 'application/vp+ld+json+jwt'
  const message = await getBinaryMessage(privateKey, messageType, messageJson)
  const messageEncoded = new TextDecoder().decode(message)
  const decodedHeader = jose.decodeProtectedHeader(messageEncoded)
  return `
// ${messageType.replace('+jwt', '')}
<pre>
${JSON.stringify(messageJson, null, 2)}
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
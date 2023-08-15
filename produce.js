import * as jose from 'jose';
import { jsonToMermaid } from './mermaid'

const sortHeader = (header) => {
  const {alg, typ, cty, iss, kid, ...rest} = header
  return JSON.parse(JSON.stringify({alg, typ, cty, iss, kid, ...rest}))
}

const issueJwt = async (header, claimset) => {
  const { alg } = header
  let token = ''
  if (alg === 'none'){
    token = `${jose.base64url.encode(JSON.stringify(sortHeader(header)))}.${jose.base64url.encode(JSON.stringify(claimset))}.`
  } else {
    const { privateKey } = await jose.generateKeyPair(alg);
    token = await new jose.SignJWT(claimset)
      .setProtectedHeader(sortHeader(header))
      .sign(privateKey);
  }
  const decoded =  `
---------------- Decoded ${alg === 'none' ? 'Unprotected' : 'Protected'} Header ----------------
${JSON.stringify(jose.decodeProtectedHeader(token), null, 2)}
---------------- Decoded ${alg === 'none' ? 'Unprotected' : 'Protected'} Claimset ----------------
${JSON.stringify(jose.decodeJwt(token), null, 2)}
---------------- Compact Encoded JSON Web Token ----------------
${token}
  `.trim()
  return decoded;
}

export const credentialExample  = async (header, example)=>{
  return {
    'application/vc+ld+json': JSON.stringify(example, null, 2),
    'text/vnd.mermaid': jsonToMermaid(example),
    'application/vc+ld+json+jwt': await issueJwt(header, example)
  }
}

export const presentationExample  = async (header, example)=>{
  return {
    'application/vp+ld+json': JSON.stringify(example, null, 2),
    'text/vnd.mermaid': jsonToMermaid(example),
    'application/vp+ld+json+jwt': await issueJwt(header, example)
  }
}

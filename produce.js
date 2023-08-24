import * as jose from 'jose';
import yaml from 'yaml'
import moment from 'moment';
import { jsonToMermaid } from './mermaid'
import SD from '@transmute/vc-jwt-sd'

const digester = SD.web.digester('sha-256')
const salter = SD.web.salter()


// const sortHeader = (header) => {
//   const {alg, typ, cty, iss, kid, ...rest} = header
//   return JSON.parse(JSON.stringify({alg, typ, cty, iss, kid, ...rest}))
// }


const computeDisclosureYaml = (example) => {
  let disclosureYaml;
  if (example.credentialSubject){
    if (Array.isArray(example.credentialSubject)){
      disclosureYaml = `
id: False
type: True
issuer:
  id: True
credentialStatus:
  id: True
    `
    } else {
      disclosureYaml = `
issuer:
  id: True
credentialStatus:
  id: True
credentialSubject:
  id: True
  type: False
    `
    }
  } else {
    disclosureYaml = `
id: True
type: True
holder:
  id: True
    `
  }
  
  return disclosureYaml
}

const issueSdJwt = async (header, example) =>{
  if (header.alg === 'none'){
    return '+sd-jwt does not support algorithm none.'
  }
  const alg = header.alg
  const iss = header.iss || 'did:web:issuer.example'
  const nonce = salter()
  const aud = 'did:web:verifier.example'
  const issuerKeyPair  = await SD.JWK.generate(alg)
  const holderKeyPair  = await SD.JWK.generate(alg)
  const issuerSigner = await SD.JWS.signer(issuerKeyPair.secretKeyJwk)
  const issuerVerifier = {
    verify: async (token) => {
      const parsed = SD.Parse.compact(token)
      const verifier = await SD.JWS.verifier(issuerKeyPair.publicKeyJwk)
      return verifier.verify(parsed.jwt)
    }
  }
  const holderSigner = await SD.JWS.signer(holderKeyPair.secretKeyJwk)
  const issuer = new SD.Issuer({
    alg,
    iss,
    kid: header.kid,
    typ: header.typ,
    cty: header.cty,
    digester,
    signer: issuerSigner,
    salter
  })

  const generatedClaimsYaml = yaml.stringify(example).replace(/id\: /g, '!sd id: ').replace(/type\:/g, '!sd type:')

  const vc = await issuer.issue({
    claims: SD.YAML.load(generatedClaimsYaml),
    iat: moment().unix(),
    exp: moment().add(1, 'years').unix(),
    holder: holderKeyPair.publicKeyJwk
  })

  const holder = new SD.Holder({
    alg,
    digester,
    signer: holderSigner
  })

  const disclosureYaml = computeDisclosureYaml(example)

  const vp = await holder.present({
    credential: vc,
    disclosure: SD.YAML.load(disclosureYaml),
    nonce,
    aud
  })
  const verifier = new SD.Verifier({
    alg,
    digester,
    verifier: issuerVerifier
  })
  const verified = await verifier.verify({
    presentation: vp,
    nonce,
    aud
  })
  

  const decoded =  `
---------------- Issuer Claims ----------------
${generatedClaimsYaml.trim()}
---------------- Holder Disclosure ----------------
${disclosureYaml.trim()}
---------------- Decoded Protected Header ----------------
${JSON.stringify(verified.protectedHeader, null, 2)}
---------------- Decoded Protected Claimset ----------------
${JSON.stringify(verified.claimset, null, 2)}
---------------- Compact Encoded Selective Disclosure JSON Web Token ----------------
${vp}
  `.trim()

  return decoded
}

// const issueJwt = async (header, claimset) => {
//   const { alg } = header
//   let token = ''
//   if (alg === 'none'){
//     token = `${jose.base64url.encode(JSON.stringify(sortHeader(header)))}.${jose.base64url.encode(JSON.stringify(claimset))}.`
//   } else {
//     const { privateKey } = await jose.generateKeyPair(alg);
//     token = await new jose.SignJWT(claimset)
//       .setProtectedHeader(sortHeader(header))
//       .sign(privateKey);
//   }
//   const decoded =  `
// ---------------- Decoded ${alg === 'none' ? 'Unprotected' : 'Protected'} Header ----------------
// ${JSON.stringify(jose.decodeProtectedHeader(token), null, 2)}
// ---------------- Decoded ${alg === 'none' ? 'Unprotected' : 'Protected'} Claimset ----------------
// ${JSON.stringify(jose.decodeJwt(token), null, 2)}
// ---------------- Compact Encoded JSON Web Token ----------------
// ${token}
//   `.trim()
//   return decoded;
// }

export const credentialExample  = async (header, example)=>{
  return {
    'application/vc+ld+json': JSON.stringify(example, null, 2),
    'text/vnd.mermaid': jsonToMermaid(example),
    // 'application/vc+ld+json+jwt': await issueJwt(header, example),
    'application/vc+ld+json+sd-jwt': await issueSdJwt(header, example)
  }
}

export const presentationExample  = async (header, example)=>{
  return {
    'application/vp+ld+json': JSON.stringify(example, null, 2),
    'text/vnd.mermaid': jsonToMermaid(example),
    // 'application/vp+ld+json+jwt': await issueJwt(header, example),
    'application/vp+ld+json+sd-jwt': await issueSdJwt(header, example),
  }
}

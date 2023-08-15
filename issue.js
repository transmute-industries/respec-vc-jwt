import * as jose from 'jose';

export const issue  = async (header, claims, privateKey)=>{
  const jwk = await jose.generateKeyPair('ES384');
  return '...'
}

// const sortHeader = (header) => {
//   const {alg, typ, cty, iss, kid, ...rest} = header
//   return JSON.parse(JSON.stringify({alg, typ, cty, iss, kid, ...rest}))
// }

// // transform the input credential to a JWT
// async function issueVerifiableCredential({credential, alg, kid, jwk}) {
  
//   const timestampMillis = Date.now();
//   const timestampSeconds = Math.floor(timestampMillis / 1000);

//   let header = { alg };
//   const claimset = credential;
//   const issued = issue(header, claimset)
//   console.log(issued)
//   let iss;
//   if (credential.issuer){
//     iss = claimset.issuer.id ? claimset.issuer.id : claimset.issuer;
//     header.typ = `vc+ld+jwt`;
//     header.iss = iss;
//     header.iat = timestampSeconds
//   }
//   if (credential.holder){
//     iss = claimset.holder.id ? claimset.holder.id : claimset.holder;
//     header.typ = `vp+ld+jwt`;
//     header.iss = iss;
//     header.iat = timestampSeconds
//     header.nonce = "n-0S6_WzA2Mj";
//     header.aud = "https://contoso.example";
//   }
//   if (kid === ''){
//     delete header.kid
//   }
//   header = sortHeader(header);
//   let jwt;
//   if (alg === 'none'){
//     header.typ = `vp+ld+jwt`;
//     delete header.kid
//     delete header.iat
//     delete header.nonce
//     delete header.aud
//     jwt = `${jose.base64url.encode(JSON.stringify(header))}.${jose.base64url.encode(JSON.stringify(claimset))}.`
//   } else {
//     jwt = await new jose.SignJWT(claimset)
//       .setProtectedHeader(header)
//       .sign(jwk.privateKey);
//   }
//   // create the JWT description
//   return `
// ---------------- Decoded ${alg === 'none' ? 'Unprotected' : 'Protected'} Header ----------------
// ${JSON.stringify(header, null, 2)}
// ---------------- Decoded ${alg === 'none' ? 'Unprotected' : 'Protected'} Claimset ----------------
// ${JSON.stringify(claimset, null, 2)}
// ---------------- Compact Encoded JSON Web Token ----------------
// ${jwt}
// `
// };
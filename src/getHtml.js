
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

export const getHtml = ({ index, coseExample })=>{
  // TODO: refactor
  // const tab1Content = getDisclosabilityHtml(claims);
  // const tab2Content = getSdHtml(vc);
  // const tab3Content = getDisclosuresHtml(disclosure);
  // const tab4Content = getSdHtml(vp);
  // const tab5Content = getVerifiedHtml(verified);

  // 3 tabs is the most that fits on 1 screen
  const tab1Content = coseExample;
  const tab2Content  = 'tab2Content';
  const tab3Content  = 'tab3Content';
  
  return `
<div class="vc-jose-cose-tabbed">
    <input type="radio" id="vc-jose-cose-tab-${index}-cose" name="vc-jose-cose-tabs-${index}" checked="checked">
    <input type="radio" id="vc-jose-cose-tab-${index}-jwt" name="vc-jose-cose-tabs-${index}" >
    <input type="radio" id="vc-jose-cose-tab-${index}-sd-jwt" name="vc-jose-cose-tabs-${index}">
    <ul class="vc-jose-cose-tabs">
      <li class="vc-jose-cose-tab">
        <label for="vc-jose-cose-tab-${index}-cose">COSE</label>
      </li>
      <li class="vc-jose-cose-tab">
        <label for="vc-jose-cose-tab-${index}-jwt">JWT</label>
      </li>
      <li class="vc-jose-cose-tab">
        <label for="vc-jose-cose-tab-${index}-sd-jwt">SD-JWT</label>
      </li>
    </ul>
    <div class="vc-jose-cose-tab-content">
${tab1Content}
    </div>
    <div class="vc-jose-cose-tab-content">
${tab2Content}
    </div>
    <div class="vc-jose-cose-tab-content">
${tab3Content}
    </div> 
</div>`
}
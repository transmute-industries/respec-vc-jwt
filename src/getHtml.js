

export const getHtml = ({ index, coseExample, jwtExample, sdJwtExample })=>{
  const tab1Content = coseExample;
  const tab2Content  = jwtExample;
  const tab3Content  = sdJwtExample;
  return `
<div class="vc-jose-cose-tabbed">
    <input type="radio" id="vc-jose-cose-tab-${index}-cose" name="vc-jose-cose-tabs-${index}" >
    <input type="radio" id="vc-jose-cose-tab-${index}-jwt" name="vc-jose-cose-tabs-${index}" >
    <input type="radio" id="vc-jose-cose-tab-${index}-sd-jwt" name="vc-jose-cose-tabs-${index}" checked="checked">
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
export function addExampleStyles() {
  const exampleStyles = document.createElement('style');

  exampleStyles.innerHTML += `

  .mermaid {
    height: 512px;
    width: 100%;
  }

  .vc-tabbed {
    overflow-x: hidden;
    margin: 0 0;
  }

  .vc-tabbed [type="radio"] {
    display: none;
  }

  .vc-tabs {
    display: flex;
    align-items: stretch;
    list-style: none;
    padding: 0;
    border-bottom: 1px solid #ccc;
  }

  li.vc-tab {
    margin: unset;
    margin-left: 8px;
  }

  .vc-tab > label {
    display: block;
    margin-bottom: -1px;
    padding: .4em .5em;
    border: 1px solid #ccc;
    border-top-right-radius: .4em;
    border-top-left-radius: .4em;
    background: #eee;
    color: #666;
    cursor: pointer;	
    transition: all 0.3s;
  }
  .vc-tab:hover label {
    border-left-color: #333;
    border-top-color: #333;
    border-right-color: #333;
    color: #333;
  }
  
  .vc-tab-content {
    display: none;
  }

  .vc-tabbed [type="radio"]:nth-of-type(1):checked ~ .vc-tabs .vc-tab:nth-of-type(1) label,
  .vc-tabbed [type="radio"]:nth-of-type(2):checked ~ .vc-tabs .vc-tab:nth-of-type(2) label,
  .vc-tabbed [type="radio"]:nth-of-type(3):checked ~ .vc-tabs .vc-tab:nth-of-type(3) label {
    border-bottom-color: #fff;
    background: #fff;
    color: #222;
  }
  
  .vc-tabbed [type="radio"]:nth-of-type(1):checked ~ .vc-tab-content:nth-of-type(1),
  .vc-tabbed [type="radio"]:nth-of-type(2):checked ~ .vc-tab-content:nth-of-type(2),
  .vc-tabbed [type="radio"]:nth-of-type(3):checked ~ .vc-tab-content:nth-of-type(3) {
    display: block;
  }

  /* begin vp styles... */

  .vp-tabbed {
    overflow-x: hidden;
    margin: 0 0;
  }

  .vp-tabbed [type="radio"] {
    display: none;
  }

  .vp-tabs {
    display: flex;
    align-items: stretch;
    list-style: none;
    padding: 0;
    border-bottom: 1px solid #ccc;
  }

  li.vp-tab {
    margin: unset;
    margin-left: 8px;
  }

  .vp-tab > label {
    display: block;
    margin-bottom: -1px;
    padding: .4em .5em;
    border: 1px solid #ccc;
    border-top-right-radius: .4em;
    border-top-left-radius: .4em;
    background: #eee;
    color: #666;
    cursor: pointer;	
    transition: all 0.3s;
  }
  .vp-tab:hover label {
    border-left-color: #333;
    border-top-color: #333;
    border-right-color: #333;
    color: #333;
  }
  
  .vp-tab-content {
    display: none;
  }

  .vp-tabbed [type="radio"]:nth-of-type(1):checked ~ .vp-tabs .vp-tab:nth-of-type(1) label,
  .vp-tabbed [type="radio"]:nth-of-type(2):checked ~ .vp-tabs .vp-tab:nth-of-type(2) label,
  .vp-tabbed [type="radio"]:nth-of-type(3):checked ~ .vp-tabs .vp-tab:nth-of-type(3) label {
    border-bottom-color: #fff;
    background: #fff;
    color: #222;
  }
  
  .vp-tabbed [type="radio"]:nth-of-type(1):checked ~ .vp-tab-content:nth-of-type(1),
  .vp-tabbed [type="radio"]:nth-of-type(2):checked ~ .vp-tab-content:nth-of-type(2),
  .vp-tabbed [type="radio"]:nth-of-type(3):checked ~ .vp-tab-content:nth-of-type(3) {
    display: block;
  }
  
  `;

  document.getElementsByTagName('head')[0].appendChild(exampleStyles);
}

# JSON Web Token Verifiable Credentials for ReSpec

Based on https://github.com/digitalbazaar/respec-vc

But with support for v2, and no JSON-LD processing.


# Usage

To use this extension, include the following line in your ReSpec file:

```html
<script class="remove" src="https://cdn.jsdelivr.net/gh/transmute-industries/respec-vc@0.0.0/dist/main.js"></script>
```

Note that there might be releases later than the one listed above. 
Check this repository's [tags](https://github.com/transmute-industries/respec-vc/tags) 
for all known releases.

# ReSpec Markup

To use this extension, you must add the `vc-jwt` class to your examples
and optionally provide a digital proof verification method (e.g., 
a URL to a public key) via the `data-vc-kid` attribute.

```html
<pre class="example nohighlight vc" title="Usage of the id property"
  data-vc-kid="https://example.edu/issuers/565049#key-1">
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  <span class="highlight">"id": "http://example.edu/credentials/3732"</span>,
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2010-01-01T00:00:00Z",
  "credentialSubject": {
    <span class="highlight">"id": "did:example:ebfeb1f712ebc6f1c276e12ec21"</span>,
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts"
    }
  }
}
</pre>
```

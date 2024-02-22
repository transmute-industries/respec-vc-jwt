# Verifiable Credential Service Worker Plugin for ReSpec

- [demo](https://decentralgabe.github.io/respec-vc-jose-cose/)

But with support for v2, and no JSON-LD processing.

# Usage

See [index.html](./index.html)

To use this extension, add the `respec-plugins` directory to your spec,
then configure respect to use the worker to post process like so:

```html
<head>
  <title>Respec Service Worker Plugin Test</title>
  <meta http-equiv='Content-Type' content='text/html;charset=utf-8' />
  <script src='https://www.w3.org/Tools/respec/respec-w3c' class='remove'></script>
  <script src="https://cdn.jsdelivr.net/gh/decentralgabe/respec-vc-jose-cose/dist/main.js"></script>
  <script type="text/javascript" class="remove">
    var respecConfig = {
      // ...
      postProcess: [window.respecVcJoseCose.processVcJoseCose]
    };
  </script>
</head>
```

You can choose to display `COSE`, `JWT`, and `SD-JWT` examples together, or individually using the following tags:
- Together: `vc-jose-cose`
- COSE: `vc-jose-cose-cose`
- JWT: `vc-jose-cose-jwt`
- SD-JWT: `vc-jose-cose-sd-jwt`

### Credits

Based on https://github.com/transmute-industries/respec-vc-jwt, which was based on the original plugin here https://github.com/digitalbazaar/respec-vc

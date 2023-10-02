# Verifiable Credential Service Worker Plugin for ReSpec

- [demo](https://transmute-industries.github.io/respec-vc-jwt/)

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
  <script src='./respec-plugins/vc-jose-cose.js'></script>
  <link rel="stylesheet" href="./respec-plugins/vc-jose-cose.css">
  <script type="text/javascript" class="remove">
    var respecConfig = {
      // ...
      postProcess: [postProcessWithWorker]
    };
  </script>
</head>
```

### Credits

Based on the original plugin here https://github.com/digitalbazaar/respec-vc

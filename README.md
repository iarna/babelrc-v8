babelrc-v8
----------

A collection of babelrcs for the v8 versions that ship with node.

### Usage

The object returned by requiring this looks like:

```
{
  "3.11.10.17": "babelrc-v8-3-11-10-17",
  "3.28.71.19": "babelrc-v8-3-28-71-19",
…
}
```

The left hand side is a v8 version and the right hand side is a module that
has the name of a module that will provide barebones babelrc for that
version of v8.  Using a babelrc matching the v8 version will give you code
as close to what you wrote as is possible– possibly with no changes at all
if you don't use any features that are unsupported by your version of v8.

If you want the path of one of these babelrcs, suitable to passing to `babel --babelrc`:

```
var pathToBabelrc = require.resolve('babelrc-v8/babelrcs/babelrc-v8-3-11-10-17')
```

### NOTICE: BABEL 6

babelrc-v8 >= 3.0.0 generates configs for Babel 6, < 3.0.0 generates config for Babel 5.

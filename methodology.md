I took the earliest and latest release per minor version starting with 0.8.6
(the version version w/ mac binaries as a tarball) and ending with 4.1.1,
including io.js.


I then generated engine configs for each of them by switching to them and running generate-module.js

```
cat earliest-minor latest-minor | tac | while read a; do nvm install $a ; node generate-module.js; done
```

This produced a list of 18 unique versions of v8:

```
3.11.10.17
3.11.10.26
3.14.5.8
3.14.5.9
3.28.71.19
3.28.73
3.31.74.1
4.1.0.12
4.1.0.14
4.1.0.21
4.1.0.27
4.2.77.18
4.2.77.20
4.2.77.21
4.4.63.26
4.4.63.30
4.5.103.30
4.5.103.33
```

Eliminating duplicates and selecting the earliest version results in:
```
Node: v0.8.6   v8: 3.11.10.17
Node: v0.12.3  v8: 3.28.71.19
Node: v1.0.0   v8: 3.31.74.1
Node: v2.0.0   v8: 4.2.77.18
Node: v3.0.0   v8: 4.4.63.26
Node: v4.0.0   v8: 4.5.103.30
```
v0.12.0 actually shipped with a more recent v8 and v0.12.3, but its feature set was identical.

So hey, the node.js maintainers haven't introduced new es6 features outside major releases! Excellent to know!

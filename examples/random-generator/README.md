## Example: Random Generator

```js
// Node.js
{randomGenerator: () => crypto.randomBytes(10)}
// browser
{randomGenerator: () => window.crypto.getRandomValues(new Uint8ClampedArray(10))}
```

- the function to call when generating the random string for specs that require random bytes, such as `Type 2`.
- should return a value compatible with _constructor_.bufferToHex (i.e. `Buffer`, `Array`<INTEGER>, or `TypedArray`) of any size/length (including 0)
- if this option is used and the `spec` option has not been set, then bronze will use _constructor_.defaultSpecForRandom
- TEST: the statement above
- TODO: See [examples](examples/random-generator/).
- _default_ = `() => {}`

# Contributing to Bronze

## General

- Search before filing an issue or pull request
- Feel free to take a try at [FUTURE.md](FUTURE.md)
- Contributions should follow our [git branching model](https://github.com/AltusAero/git-branching-model)
- Create tests for new features.
  - If you need help we can work through this during the PR process, but it will take additional time.
- When it comes to performance vs readability the following order is preferred:
  - performance gains in an order of magnitude
  - code readability (including modern syntax)
- Update [CHANGELOG.md](CHANGELOG.md) - preferably adding to the `[Unreleased]` section
- Feel free to add yourself to the [AUTHORS](AUTHORS) file after making a contribution
- If you are interested in tackling TODOs and others challenges in the codebase feel free to search by using the following regex:
  ```js
  /@?(TODO|FIXME|CHANGED|XXX|IDEA|HACK|NOTE|REVIEW|NB|BUG|QUESTION|COMBAK|TEMP|TEST|FIX):/
  ```
  - You can also use the same pattern in the comments of any contribution
- You must agree to the [Developer's Certificate of Origin](http://developercertificate.org) (found below).

## Style Guide

JavaScript: [JavaScript Standard Style](http://standardjs.com)
TypeScript: [JavaScript Standard Style](http://standardjs.com)

## Code of Conduct

Just be cool. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) on what we think this means.

## Developer's Certificate of Origin

```text
Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

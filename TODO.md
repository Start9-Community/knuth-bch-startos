# TODO — Knuth

## Pending

- [ ] Decide whether to keep declaring `aarch64` and `riscv64`. The kth toolchain image
      is amd64-only, so both run under emulation — functional, but far too slow to sync
      mainnet. Either drop them from the manifest or keep the current arrangement and
      leave the Limitations note in `README.md` and `instructions.md` as the warning.
- [ ] Audit `scripts/rpc_compat.py` line by line. It parses the block store directly to
      answer `getblock`, `getrawtransaction`, and `getblocktemplate`, and it is what
      every dependent service actually talks to — a defect there looks like a broken
      node, not a broken shim. It has not been reviewed as part of the packaging audit.
- [ ] Exercise the JSON-RPC path end to end against a real dependent (Fulcrum or BCH
      Explorer), not just a `getblockchaininfo` probe.
- [ ] Confirm the `synced-true` oneshot fires and that `fullySynced` is read by whatever
      depends on it — nothing in this package reads it back, so it exists for dependents.
- [ ] Re-check `peer-connections`. It parses `Peers: n / m` out of `debug.log`, so an
      upstream log-format change silently breaks it with no compile error.

# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **A wrong config key fails silently.** kth calls `allow_config_extras()`, so an unrecognised key in `kth.cfg` is ignored rather than rejected — the node starts and runs on its own default. Verify every key in `startos/fileModels/knuth.conf.ts` against the binary you are pinning; do not carry one over on the strength of it having worked before. Values are the opposite: an _invalid value_ for a valid key aborts startup ("illegal value"), which is how `db.db_mode` crash-looped installs that skipped the 1.3.0 migration.
- **Endpoint-valued options must be omitted, not blanked.** `log.statistics_server` and `net.self` are `.optional()` for that reason — writing an empty string is an illegal value.
- **This package builds kth from source, and the build is slow.** 30–60 minutes per architecture on CI, and the toolchain image is amd64-only, so aarch64 and riscv64 ship that image with `emulateMissingAs: 'x86_64'`. Push and let CI build; don't compile locally to check a TypeScript change.
- **`main.ts` reads `store.json` with `.once()` on purpose.** A reactive read of the whole store would restart the node every time the `synced-true` oneshot writes `fullySynced`. Every action that changes a store field the daemon depends on therefore calls `effects.restart()` itself — if you add one, add the restart. `interfaces.ts` is the opposite: it reads reactively, because the JSON-RPC toggle and the network switch have to re-derive the exported interfaces without waiting for an update.
- **`kth.cfg` is never read by `main.ts`.** kth loads it at process start, so a config change only takes effect on restart, which is the other reason those actions restart explicitly.
- **The health rows that are not network probes are capability advertisements.** `utxoz` and `ipc-capi` report what this node offers dependent services; `i2p` is a placeholder for a capability kth does not have. They are deliberately not interfaces — kth listens on exactly two ports, P2P and JSON-RPC.

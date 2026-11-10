# Updating the upstream version

This package builds Knuth from source in its own `Dockerfile` rather than pulling a prebuilt image, because the official `ghcr.io/k-nuth/kth` image is built without the `rpc` conan option and therefore has no JSON-RPC server.

## Determining the upstream version

- Latest release tag:

  ```sh
  gh release view -R k-nuth/kth --json tagName -q .tagName
  ```

The current pin is `ARG KNUTH_VERSION` in `Dockerfile`. **It is the version _without_ the leading `v`** — conan resolves `kth/1.3.0`, and `kth/v1.3.0` does not exist. A bump that copies the tag verbatim fails the image build.

## Applying the bump

1. Set `ARG KNUTH_VERSION` in `Dockerfile` to the new version, dropping the `v`.
2. Edit `startos/versions/current.ts` in place: raise `version` to `<new upstream>:0` and rewrite `releaseNotes` in all five locales. Do **not** add a new version file unless the version currently in `current.ts` carries a migration — see the packaging guide's `versions.md`.
3. Push the branch and let CI build. The from-source compile takes 30–60 minutes per architecture, so building locally is rarely worth it.
4. Install the result and confirm the node starts, reaches peers, and — with the JSON-RPC server turned on — answers `getblockchaininfo`.

## Checking a config-key rename

kth calls `allow_config_extras()`, so a stale key in `kth.cfg` is **silently ignored** rather than rejected: the node starts and quietly runs on its own default. Any upstream release that renames or retypes a configuration option therefore needs the key names in `startos/fileModels/knuth.conf.ts` checked against the new binary, and a migration written for existing installs — this is exactly what `startos/versions/v1.3.0.1.ts` does for the 1.3.0 rename.

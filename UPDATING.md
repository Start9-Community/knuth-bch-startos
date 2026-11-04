# Updating the upstream version

This package builds **Knuth** ([k-nuth/kth](https://github.com/k-nuth/kth)) from source in the `Dockerfile`.

## Determining the upstream version

Check the latest tag on the [releases page](https://github.com/k-nuth/kth/releases); tags carry a leading `v` (`v1.3.0`). The current pin is `ARG KNUTH_VERSION=` in the `Dockerfile`. The build installs that version from the kth Conan remote (`packages.kth.cash`).

## Applying the bump

1. Set `ARG KNUTH_VERSION=<new version>` in the `Dockerfile`, **without** the `v` (Conan takes `1.3.0`, not `v1.3.0`).
2. Update the upstream version stated in `README.md`.

The build stage runs on `ARG TOOLCHAIN=kthnode/gcc15-ubuntu24.04@sha256:<digest>`, the Knuth project's own compiler image, pinned by digest. Keep it on the image Knuth builds the new release with.

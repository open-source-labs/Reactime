
# The Reivision History of Universal Zopfli

## v1.0.14 2019/07/06

https://github.com/gfx/universal-zopfli-js/compare/v1.0.13...v1.0.14

* Build with Emscripten v1.38.37 with the LLVM backend
  * cf. [Emscripten and the LLVM WebAssembly backend · V8](https://v8.dev/blog/emscripten-llvm-wasm)

## v1.0.13 2019/05/27

https://github.com/gfx/universal-zopfli-js/compare/v1.0.12...v1.0.13

* Build with Emscripten v1.38.32

## v1.0.12 2019/05/16

https://github.com/gfx/universal-zopfli-js/compare/v1.0.11...v1.0.12

* Use emcc optimization of `-O3` instead of `-Oz` in release build
  * https://emscripten.org/docs/tools_reference/emcc.html
* Build with Emscripten v1.38.31

## v1.0.11 2019/02/15

https://github.com/gfx/universal-zopfli-js/compare/v1.0.10...v1.0.11

* [.d.ts] `InputType` now accept `Readonly<Uint8Array>` and `ReadonlyArray<number>` instead of mutable ones ([#11](https://github.com/gfx/universal-zopfli-js/pull/11))
* Build with Emscripten v1.38.25

## v1.0.10 2018/11/14

https://github.com/gfx/universal-zopfli-js/compare/v1.0.9...v1.0.10

* Build with Emscripten v1.38.17

## v1.0.9 2018/09/11

https://github.com/gfx/universal-zopfli-js/compare/v1.0.8...v1.0.9

* Ship with Zopfli v1.0.2 (but no code change from the previous, untagged rev.)
* Build with Emscripten v1.38.12

## v1.0.8 2018/04/27

https://github.com/gfx/universal-zopfli-js/compare/v1.0.7...v1.0.8

* Build with Emscripten v1.37.38

## v1.0.7 2018/01/23

https://github.com/gfx/universal-zopfli-js/compare/v1.0.5...v1.0.7

* Build with Emscripten v1.37.28 for reduce the package size

## v1.0.5 2017/12/15

https://github.com/gfx/universal-zopfli-js/compare/v1.0.0...v1.0.5

* Build with Emscripten v1.37.25 for reduce the package size

## v1.0.0 2017/11/16

* Initial Release

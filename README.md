Website here: https://mfarzan.ir/learncontrol/

Project structure notes:

1. Diagrams are genarated using the Makefile at `/diagrams` (Use `make install` to copy them where React can find them). The genarated files are copied to `/src/img`. The output files are commited as well, so you don't have to run this step at all, unless you're adding new diagrams.
2. Heavy calculations are handled using WebAssembly. The Makefile at `/wasm/learncontrolwasm` builds the rust package and `make install` stores a symlink of the locally built package. The package binaries are commited, so if you're not modifiying the rust code you can just link to the prebuilt wasm package using `make install`. (`all` target should be satisfied, but if it still gives error, run the make instructions manually.)
3. Use `npm start` to start developement server and `npm run build` to create optimized static files. One build is needed per language, and all languages except English go under `/<lang_code>` subdirectory. A symlink of `/en` to `/` is required too.

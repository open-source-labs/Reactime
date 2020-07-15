/**
    Copyright 2017, FUJI Goro (gfx).

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
export interface ZopfliOptions {
    /** Whether to print output */
    verbose?: boolean;
    /** Whether to print more detailed output  */
    verbose_more?: boolean;
    /**
        Maximum amount of times to rerun forward and backward pass to optimize LZ77
        compression cost. Good values: 10, 15 for small files, 5 for files over
        several MB in size or it will be too slow.
     */
    numiterations?: number;
    /**
        If true, splits the data in multiple deflate blocks with optimal choice
        for the block boundaries. Block splitting gives better compression. Default:
        true (1).
     */
    blocksplitting?: boolean;
    /**
        Maximum amount of blocks to split into (0 for unlimited, but this can give
        extreme results that hurt compression on some files). Default value: 15.
     */
    blocksplittingmax?: number;
}
export declare type OnCompressComplete = (err: Error | null, buffer: Uint8Array) => void;
declare type BufferType = Readonly<Uint8Array> | ReadonlyArray<number>;
export declare type InputType = BufferType | string;
export declare function gzip(buffer: InputType, options: ZopfliOptions, cb: OnCompressComplete): void;
export declare function zlib(buffer: InputType, options: ZopfliOptions, cb: OnCompressComplete): void;
export declare function deflate(buffer: InputType, options: ZopfliOptions, cb: OnCompressComplete): void;
export declare const gzipAsync: (buffer: InputType, options: ZopfliOptions) => Promise<Uint8Array>;
export declare const zlibAsync: (buffer: InputType, options: ZopfliOptions) => Promise<Uint8Array>;
export declare const deflateAsync: (buffer: InputType, options: ZopfliOptions) => Promise<Uint8Array>;
export {};

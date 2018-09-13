// Shared types for bronze
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array

export interface BronzeSpecs {
  '1a': true,
  '1b': true,
  '1c': true,
  '1d': true,
  '2a': true,
  '2b': true,
  '2c': true,
  '2d': true
}

export type BronzeSpec = keyof BronzeSpecs

export interface BronzeInstanceOptions {
  sequence?: number,
  pid?: number,
  randomGenerator?: () => TypedArray,
  spec?: string,
  name?: string,
}

export interface BronzeGenerateStringOptions {
  json?: false | null
}

export interface BronzeGenerateObjectOptions {
  json: true
}

export type BronzeGenerateOptions = BronzeGenerateStringOptions | BronzeGenerateObjectOptions | undefined

export interface BronzeInstanceProperties {
  name: string,
  nameRaw: string,
  pid: number,
  randomGenerator: () => TypedArray,
  sequence: number,
  spec: BronzeSpec,
  useRandom: boolean
}

export interface BronzeIdObject {
  sequence: number,
  pid: number,
  randomString?: string | null,
  spec: BronzeSpec,
  name: string,
  timestamp: number
}

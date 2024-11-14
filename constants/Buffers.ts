import * as Block from 'multiformats/block'
import * as raw from 'multiformats/codecs/raw'
import { from } from 'multiformats/hashes/hasher'
import { blake3 } from '@noble/hashes/blake3'

export type Content = {
  uri: string
  mime: string
  height?: number
  width?: number
}

export type Metadata = {
  name: string
  description: string
  content?: Content
}

/*
  AUTH BUFFERS
*/

export function stringToHash(input: string): Uint8Array {
  return blake3(input, { dkLen: 32 })
}

/*
  PROTOCOL BUFFERS
*/

const blake3Hasher = from({
  name: 'blake3',
  code: 0x1e,
  encode: (input) => blake3(input),
})

export async function uint8ArrayToMessageData(bytes: Uint8Array) {
  const block = await Block.decode({
    bytes,
    codec: raw,
    hasher: blake3Hasher,
  })
  return block.value
}

export async function bytesToCid(bytes: Uint8Array) {
  const block = await Block.encode({
    value: bytes,
    codec: raw,
    hasher: blake3Hasher,
  })
  return {
    bytes: block.bytes,
    cid: block.cid.toString(),
  }
}
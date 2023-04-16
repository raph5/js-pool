
export type coordinates2D = Array<i16>  // x, y (px)
export type coordinates3D = Array<f32>  // x, y, z (px)

export type rgb = Array<u8>  // r, g, b
export type rgba = Array<u8>  // r, g, b, a

export type pixelMap = Map<coordinates2D, rgb>  // Map<[x, y], [r, g, b]>

export type coordinates2D = Array<i16>  // x, y (px)
export type coordinates3D = Array<f32>  // x, y, z (px)

export type rgb = Array<i16>  // r, g, b
export type rgba = Array<i16>  // r, g, b, a

export type pixelMap = Map<coordinates2D, rgb>  // Map<[x, y], [r, g, b]>
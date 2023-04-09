
export type coordinates2D = [i16, i16]  // x, y (px)
export type coordinates3D = [f32, f32, f32]  // x, y (px)

export type rgb = [i8, i8, i8]  // r, g, b
export type rgba = [i8, i8, i8, i8]  // r, g, b, a

export type pixelMap = Map<coordinates2D, rgb>  // Map<[x, y], [r, g, b]>
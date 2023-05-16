
/**
 * Class to manage quaternions
 * see https://jeux.developpez.com/faq/math/?page=quaternions
 */
export class Quaternion {

  /**
   * Create a new quaternion
   * @param {number} w
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(w, x, y, z) {
    /** @type {Float32Array} */
    this.quat = new Float32Array(4)
    this.quat[0] = w
    this.quat[1] = x
    this.quat[2] = y
    this.quat[3] = z
  }

  /**
   * Reutrn conjugate magnitude
   * see https://jeux.developpez.com/faq/math/?page=quaternions#Q50
   */
  getMagnitude() {
    return Math.sqrt(
      this.quat[0]**2 +
      this.quat[1]**2 +
      this.quat[2]**2 +
      this.quat[3]**2
    )
  }

  /**
   * normalize
   * see https://jeux.developpez.com/faq/math/?page=quaternions#Q51
   */
  normalize() {
    const magnitude = this.getMagnitude()
    this.quat[0] = this.quat[0] / magnitude
    this.quat[1] = this.quat[1] / magnitude
    this.quat[2] = this.quat[2] / magnitude
    this.quat[3] = this.quat[3] / magnitude
  }

  /**
   * multiply quaternion by an other quat
   * see https://jeux.developpez.com/faq/math/?page=quaternions#Q53
   * @param {Quaternion} quaternion 
   */
  multiply(quaternion) {
    const qa_w = this.quat[0]
    const qa_x = this.quat[1]
    const qa_y = this.quat[2]
    const qa_z = this.quat[3]

    const qb_w = quaternion.quat[0]
    const qb_x = quaternion.quat[1]
    const qb_y = quaternion.quat[2]
    const qb_z = quaternion.quat[3]

    const va_x = qa_y*qb_z - qa_z*qb_y
    const va_y = qa_z*qb_x - qa_x*qb_z
    const va_z = qa_x*qb_y - qa_y*qb_x

    const vb_x = qa_x*qb_w
    const vb_y = qa_y*qb_w
    const vb_z = qa_z*qb_w

    const vc_x = qb_x*qa_w
    const vc_y = qb_y*qa_w
    const vc_z = qb_z*qa_w

    this.quat[0] = qa_x*qb_x + qa_y*qb_y + qa_z*qb_z
    this.quat[1] = va_x + vb_x + vc_x
    this.quat[2] = va_y + vb_y + vc_y
    this.quat[3] = va_z + vb_z + vc_z

    this.normalize()
  }

  /**
   * see https://jeux.developpez.com/faq/math/?page=quaternions#Q54
   */
  toRotationMatrix() {
    const xx = this.quat[1] * this.quat[1];
    const xy = this.quat[1] * this.quat[2];
    const xz = this.quat[1] * this.quat[3];
    const xw = this.quat[1] * this.quat[0];
    const yy = this.quat[2] * this.quat[2];
    const yz = this.quat[2] * this.quat[3];
    const yw = this.quat[2] * this.quat[0];
    const zz = this.quat[3] * this.quat[3];
    const zw = this.quat[3] * this.quat[0];

    const mat = new Float32Array(9);

    mat[0] = 1 - 2*yy - 2*zz
    mat[1] = 2*xy - 2*zw
    mat[2] = 2*xz + 2*yw

    mat[3] = 2*xy + 2*zw
    mat[4] = 1 - 2*xx - 2*zz
    mat[5] = 2*yz - 2*xw

    mat[6] = 2*xz - 2*yw
    mat[7] = 2*yz + 2*xw
    mat[8] = 1 - 2*xx - 2*yy

    return mat
  }

  /**
   * take a point
   * rotate it with quaternion
   * reutrn its new coordinates
   * @param {Float32Array} point
   * @returns {Float32Array}
   */
  rotatePoint(point) {

    // rotation matrix
    const matrix = this.toRotationMatrix()

    // rotate point
    const x = point[0] * matrix[0] + point[1] * matrix[1] + point[2] * matrix[2]
    const y = point[0] * matrix[3] + point[1] * matrix[4] + point[2] * matrix[5]
    const z = point[0] * matrix[6] + point[1] * matrix[7] + point[2] * matrix[8]
    point[0] = x
    point[1] = y
    point[2] = z

    return point

  }

}


/**
 * create the appropriate quaternion for a rotation
 * https://jeux.developpez.com/faq/math/?page=quaternions#Q56
 * @param {number} angle
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Quaternion}
 */
export function rotationToQuaternion(angle, x, y, z) {

  // normalyse vector
  const magnitude = Math.sqrt( x**2 + y**2 + z**2 )
  x = x / magnitude
  y = y / magnitude
  z = z / magnitude

  // recuptation
  const cos_angle = Math.cos(angle / 2)
  const sin_angle = Math.sin(angle / 2)

  const quat = new Quaternion(
    cos_angle,
    x * sin_angle,
    y * sin_angle,
    z * sin_angle
  )

  quat.normalize()

  return quat

}
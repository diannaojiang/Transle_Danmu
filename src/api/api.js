export const api = {
  /**
   * Sign Up
   * @param {{
   *  user: string
   *  pass: string
   * }} payload
   */
  async signup ({ user, pass }) {
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (Math.random() > 0.5) {
      return {
        status: 'ok'
      }
    } else {
      throw new Error('error: bad luck')
    }
  }
}

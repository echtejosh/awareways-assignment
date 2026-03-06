const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export class UserId {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static isValid(value: string): boolean {
    return UUID_PATTERN.test(value)
  }

  static tryCreate(value: string): UserId | null {
    const trimmed = value.trim()
    if (!this.isValid(trimmed)) {
      return null
    }

    return new UserId(trimmed.toLowerCase())
  }

  static create(value: string): UserId {
    const userId = this.tryCreate(value)
    if (!userId) {
      throw new Error("Invalid user_id.")
    }

    return userId
  }

  toString(): string {
    return this.value
  }
}

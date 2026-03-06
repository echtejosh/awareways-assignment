import type {
  CreateUserInput,
  UserDirectoryRepository,
} from "@/domain/users/repositories/user-directory-repository"

/**
 * Creates a new user directory entry from the UI modal flow.
 */
export class CreateUserUseCase {
  private readonly userDirectoryRepository: UserDirectoryRepository

  constructor(userDirectoryRepository: UserDirectoryRepository) {
    this.userDirectoryRepository = userDirectoryRepository
  }

  /**
   * Delegates creation to the repository port.
   */
  execute(input: CreateUserInput) {
    return this.userDirectoryRepository.createUser(input)
  }
}

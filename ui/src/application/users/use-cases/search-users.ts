import type {
  SearchUsersInput,
  UserDirectoryRepository,
} from "@/domain/users/repositories/user-directory-repository"

/**
 * Reads user directory entries for combobox-style selection.
 */
export class SearchUsersUseCase {
  private readonly userDirectoryRepository: UserDirectoryRepository

  constructor(userDirectoryRepository: UserDirectoryRepository) {
    this.userDirectoryRepository = userDirectoryRepository
  }

  /**
   * Delegates the directory search to the repository port.
   */
  execute(input: SearchUsersInput) {
    return this.userDirectoryRepository.searchUsers(input)
  }
}

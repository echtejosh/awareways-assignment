import type {
  SearchUsersInput,
  UserDirectoryRepository,
} from "@/domain/users/repositories/user-directory-repository"

export class SearchUsersUseCase {
  private readonly userDirectoryRepository: UserDirectoryRepository

  constructor(userDirectoryRepository: UserDirectoryRepository) {
    this.userDirectoryRepository = userDirectoryRepository
  }

  execute(input: SearchUsersInput) {
    return this.userDirectoryRepository.searchUsers(input)
  }
}

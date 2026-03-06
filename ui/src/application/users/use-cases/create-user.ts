import type {
  CreateUserInput,
  UserDirectoryRepository,
} from "@/domain/users/repositories/user-directory-repository"

export class CreateUserUseCase {
  private readonly userDirectoryRepository: UserDirectoryRepository

  constructor(userDirectoryRepository: UserDirectoryRepository) {
    this.userDirectoryRepository = userDirectoryRepository
  }

  execute(input: CreateUserInput) {
    return this.userDirectoryRepository.createUser(input)
  }
}

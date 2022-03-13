import CategoryRepository from "../../domain/repositories/category.repository";
import { CategoryOutputDto } from "./dto/category.dto";
import Category from "../../domain/entities/category";
import UseCase from '../../../@seedwork/application/use-case';
import BadEntityOperationError from '../../../@seedwork/application/errors/bad-entity-operation.error';
export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const entity = Input.toEntity(input);
    if(!entity.is_valid){
      throw new BadEntityOperationError(entity.error);
    }
    await this.categoryRepository.insert(entity);
    return this.toOutput(entity);
  }

  toOutput(entity: Category): Output {
    return Output.fromEntity(entity);
  }
}

export default CreateCategoryUseCase;

export class Input {
  name: string;
  description?: string;
  is_active?: boolean;

  static toEntity(input: Input) {
    return new Category(input);
  }
}

export class Output extends CategoryOutputDto {
  
}

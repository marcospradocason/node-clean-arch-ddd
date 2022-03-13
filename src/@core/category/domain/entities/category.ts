import AggregateRoot from "../../../@seedwork/domain/entity/aggregate-root";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id";
import CategoryValidatorFactory from "../validators/category.validator";
import ValidatorRules from "../../../@seedwork/domain/validators/validator-rules";

export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};
export class Category extends AggregateRoot<CategoryProperties> {

  constructor(props: CategoryProperties, id?: UniqueEntityId) {
    super(props, id);
    this.description = this.props.description;
    this.props.is_active = props.is_active ?? this.activate();
    this.props.created_at = props.created_at ?? new Date();
    this.validate();
  }

  update(name: string, description?: string) {
    this.props.name = name;
    this.description = description;
    this.validate();
  }

  _validate() {
    ValidatorRules.values(this.props.name, "name")
      .required()
      .string()
      .maxLength(255);
    ValidatorRules.values(this.props.description, "description").string();
    ValidatorRules.values(this.props.is_active, "is_active")
      .required()
      .boolean();
  }

  //validate() {
    // CategoryValidatorFactory.create().validate({
    //   id: this.uniqueEntityId,
    //   ...this.props,
    // });
  //}

  protected validate() {
    this.error.clear();

    if (this.uniqueEntityId instanceof UniqueEntityId && !this.uniqueEntityId.is_valid) {
      this.error.add({ id: this.uniqueEntityId.error.errors as string[] });
    }

    const categoryValidator = CategoryValidatorFactory.create();
    const isValid = categoryValidator.validate({
      id: this.uniqueEntityId,
      ...this.props
    });

    if (!isValid) {
      for (const field of Object.keys(categoryValidator.errors)) {
        this.error.add({ [field]: categoryValidator.errors[field] });
      }
    }

    return this.error.hasError();
  }

  activate(): true {
    this.props.is_active = true;
    return this.props.is_active;
  }

  deactivate(): false {
    this.props.is_active = false;
    return this.props.is_active;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active() {
    return this.props.is_active;
  }
}

export default Category;

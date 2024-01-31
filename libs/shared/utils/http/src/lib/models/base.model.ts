export abstract class SchemaModel<TFrom, TTo = Partial<TFrom>> {
  public abstract fromSchema(schema: TFrom): void;
  public abstract toSchema?(): TTo;
}

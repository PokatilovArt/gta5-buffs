export class EnumUtils {
  public static isInEnum<T extends Record<string, unknown>>(
    enumObj: T,
    value: unknown,
  ): value is T[keyof T] {
    return Object.values(enumObj).includes(value);
  }

  public static getEnumValues<T extends object>(obj: T): string[] {
    return Object.values(obj);
  }

  public static getEnumByValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string,
  ): T[keyof T] | null {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);

    return keys.length > 0 ? (myEnum[keys[0]] as T[keyof T]) : null;
  }

  public static getEnumByKey<T extends { [index: string]: string }>(
    myEnum: T,
    enumKey: string,
  ): T[keyof T] | null {
    const keys = Object.keys(myEnum).filter(x => x === enumKey);

    return keys.length > 0 ? (myEnum[keys[0]] as T[keyof T]) : null;
  }
}

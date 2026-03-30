export class RandomUtils {
  public static randomInt(min: number, max: number): number {
    max = Math.ceil(max);
    min = Math.floor(min);

    return Math.floor(Math.random() * (min - max)) + max;
  }
}

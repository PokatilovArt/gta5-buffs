export interface MultiplayerRepository<T> {
  findById(id: number): T | null;
}

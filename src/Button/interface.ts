import { ButtonEventDto } from './event/dto';

export interface ButtonInterface {
  activate(): void;
  deactivate(): void;
  emitKeyUp(dto: ButtonEventDto): void;
  emitKeyDown(dto: ButtonEventDto): void;
  onRender(handler: (composedImage: Buffer) => void): void;
}

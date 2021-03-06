import { template } from "../template";

export abstract class Component<State = Record<string, any>> {
  protected el: HTMLDivElement;

  protected state: State = {} as State;

  protected events: Record<string, (event?: Event) => void> = {} as Record<
    string,
    () => void
  >;

  constructor(el: HTMLDivElement, initialState?: Partial<State>) {
    this.el = el;
    this.state = { ...this.state, ...initialState };

    setTimeout(() => {
      this.render();
      this.subscribeToEvents();
      this.onMount();
    }, 0);
  }

  protected abstract template(): string;

  private render(): void {
    this.el.innerHTML = template(this.template(), this.state);
  }

  protected onMount(): void {
    return null;
  }

  setState = (patch: Partial<State>): void => {
    this.state = { ...this.state, ...patch };
    this.render();
    this.subscribeToEvents();
  };

  subscribeToEvents(): void {
    Object.keys(this.events).forEach((key: string) => {
      const [eventName, selector] = key.split("@");
      [...Array.from(this.el.querySelectorAll(`${selector}`))].forEach(
        (elem) => {
          elem.addEventListener(`${eventName}`, this.events[key]);
        }
      );
    });
  }
}

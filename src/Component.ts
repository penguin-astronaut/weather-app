import { template } from "./template";

interface State {
  [key: string]: any;
}

export abstract class Component {
  protected el: HTMLDivElement;

  protected state: State = {} as State;

  protected events: Record<string, () => void> = {} as Record<
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

  protected template(): string {
    return "";
  }

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

/* eslint-disable no-new */
import { Component } from "./Component";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("Component", () => {
  let el: HTMLDivElement;
  beforeEach(() => {
    el = document.createElement("div");
  });

  it("is a class", () => {
    expect(Component).toBeInstanceOf(Function);
    class TestComponent extends Component {}
    expect(new TestComponent(el)).toBeInstanceOf(Component);
  });

  it("can render props from state", async () => {
    const text = String(Math.random());
    class TestComponent extends Component {
      state = {
        text,
      };

      template() {
        return `<h1>{{text}}</h1>`;
      }
    }
    new TestComponent(el);
    await sleep(10);

    expect(el.innerHTML).toBe(`<h1>${text}</h1>`);
  });

  it("updates presentation on setState call", async () => {
    const text = String(Math.random());

    const text2 = String(Math.random());

    class TestComponent extends Component {
      state = { text, count: 1 };

      template() {
        return `<h1>{{text}}|{{count}}</h1>`;
      }
    }
    const component = new TestComponent(el);
    await sleep(10);
    expect(component.setState).toBeInstanceOf(Function);
    component.setState({
      text: text2,
    });
    expect(el.innerHTML).toBe(`<h1>${text2}|1</h1>`);
  });

  it("calls events from `.events` declaration", async () => {
    const onH1Click = jest.fn();
    const onButtonClick = jest.fn();
    const onButtonXClick = jest.fn();

    class TestComponent extends Component {
      onH1Click = onH1Click;

      onButtonClick = onButtonClick;

      onButtonXClick = onButtonXClick;

      events = {
        "click@h1": this.onH1Click,
        "click@button": this.onButtonClick,
        "click@button.x": this.onButtonXClick,
      };

      template() {
        return `
          <h1>0</h1>
          <button>1</button>
          <button class="x">2</button>
        `;
      }
    }
    new TestComponent(el);
    await sleep(10);
    expect(onH1Click).not.toHaveBeenCalled();
    expect(onButtonClick).not.toHaveBeenCalled();
    expect(onButtonXClick).not.toHaveBeenCalled();

    // el.querySelector("h1")?.click();
    el.querySelector("h1")?.dispatchEvent(
      new window.Event("click", {
        bubbles: true,
      })
    );
    expect(onH1Click).toHaveBeenCalledTimes(1);

    el.querySelector("button")?.click();
    expect(onButtonClick).toHaveBeenCalledTimes(1);

    (el.querySelector("button.x") as HTMLElement)?.click();
    expect(onButtonClick).toHaveBeenCalledTimes(2);
    expect(onButtonXClick).toHaveBeenCalledTimes(1);
  });

  it("inital state", async () => {
    class TestComponent extends Component {
      template() {
        return `<h1>{{name}}</h1>`;
      }
    }

    new TestComponent(el, { name: "Alex", secondName: "Blake" });
    await sleep(10);
    expect(el.querySelector("h1").innerHTML).toBe("Alex");
  });

  it("On mount", async () => {
    class TestComponent extends Component {
      template() {
        return `<h1>{{name}}</h1><p></p>`;
      }

      onMount(): void {
        this.el.querySelector("p").innerHTML = "Mounted";
      }
    }

    new TestComponent(el, { name: "Alex", secondName: "Blake" });
    await sleep(10);
    expect(el.querySelector("p").innerHTML).toBe("Mounted");
  });
});

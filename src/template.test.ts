import { template } from "./template";

describe("template", () => {
  const data = {
    NAME: "Bob",
    AGE: "18",
    TEAM: "Core",
    render: true,
    notRender: false,
    user: {
      age: 12,
    },
    items: [
      { A: 1, B: 2 },
      { A: 11, B: 22 },
      { A: 111, B: 222 },
    ],
  };

  describe("basic data placing", () => {
    it("puts data into placeholders", () => {
      expect(template("Hi, {{NAME}}", data)).toBe("Hi, Bob");
    });

    it("puts empty string into placeholders in no data provided", () => {
      expect(template("Hi, {{NAME}} {{SURNAME}}", data)).toBe("Hi, Bob ");
    });

    it("replaces all placeholders", () => {
      expect(template("Hi, {{NAME}}. My name is {{NAME}} too", data)).toBe(
        "Hi, Bob. My name is Bob too"
      );
    });
    it("get obj value", () => {
      expect(template("Age is {{user.age}}{{user.age2}}", data)).toBe(
        "Age is 12"
      );
    });
  });

  describe("loops", () => {
    it("puts values from list elements inside loop", () => {
      expect(
        template(
          "{{NAME}}{{for item in items}}{{item.NAME}}{{NAME}},{{endfor}}",
          {
            NAME: "0 ",
            items: [{ NAME: "1" }, { NAME: "2" }],
          }
        )
      ).toBe("0 10 ,20 ,");
    });

    it("handles basic loops", () => {
      expect(template("{{for word in items}}{{word.A}},{{endfor}}", data)).toBe(
        "1,11,111,"
      );
    });

    it("check helper vars", () => {
      expect(
        template(
          "{{NAME}}{{for item in items}}{{item}}: number-{{index}}, isLast:{{isLast}}, isFirst: {{isFirst}};{{endfor}}",
          {
            items: ["Alex", "Blake", "Naomi", "Vasya"],
          }
        )
      ).toBe(
        "Alex: number-0, isLast:false, isFirst: true;Blake: number-1, isLast:false, isFirst: false;Naomi: number-2, isLast:false, isFirst: false;Vasya: number-3, isLast:true, isFirst: false;"
      );
    });
  });

  describe("conditional rendering", () => {
    it("simple conditional", () => {
      expect(template("{{if render}}I'm render{{endif}}", data)).toBe(
        "I'm render"
      );
      expect(template("{{if notRender}}I'am not render{{endif}}", data)).toBe(
        ""
      );
      expect(
        template("{{if render}}render name: {{NAME}}{{endif}}", data)
      ).toBe(`render name: ${data.NAME}`);
    });
    it("conditional with loop", () => {
      expect(
        template(
          "{{for item in items}}{{item.NAME}}{{if item.isAdmin}} - admin;{{endif}}{{endfor}}",
          {
            items: [
              { NAME: "1", isAdmin: true },
              { NAME: "2", isAdmin: false },
            ],
          }
        )
      ).toBe("1 - admin;2");
    });
    it("conditional with loop and global var", () => {
      expect(
        template(
          "{{for item in items}}{{item.NAME}}{{if render }} - admin;{{endif}}{{endfor}}",
          {
            items: [
              { NAME: "1", isAdmin: true },
              { NAME: "2", isAdmin: false },
            ],
          }
        )
      ).toBe("12");
    });
  });
});

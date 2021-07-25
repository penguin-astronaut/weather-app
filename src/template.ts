export function template(tpl: string, data: Record<string, any>): string {
  tpl = tpl.replace(
    /{{\s*for (\S+?) in (\S+?)\s*}}([\s\S]+?){{\s*endfor\s*}}/g,
    (
      matchString: string,
      itemName: string,
      listName: string,
      body: string
    ): string => {
      const result = data[listName].map((item: any, index: number) => {
        const newData = {
          ...data,
          index,
          isFirst: index === 0,
          isLast: data[listName].length === index + 1,
        };
        newData[itemName] = item;
        return template(body, newData);
      });
      return result.join("");
    }
  );

  tpl = tpl.replace(
    /{{\s*if (\S+?)\s*}}([\s\S]+?){{\s*endif\s*}}/g,
    (matchString: string, varibleName: string, body: string): string => {
      const [name, subName] = varibleName.split(".");
      if (typeof subName !== "undefined" && data[name][subName]) {
        return template(body, data);
      } if (typeof subName !== "undefined" && !data[name][subName]) {
        return "";
      }
      return data[name] ? template(body, data) : "";
    }
  );

  tpl = tpl.replace(
    /{{\s*(\S+?)\s*}}/g,
    (matchString: string, valueName: string) => {
      const [name, subName] = valueName.split(".");
      if (typeof subName !== "undefined" && data[name][subName]) {
        return data[name][subName];
      } if (typeof subName !== "undefined" && !data[name][subName]) {
        return "";
      }

      return data[name] ?? "";
    }
  );

  return tpl;
}

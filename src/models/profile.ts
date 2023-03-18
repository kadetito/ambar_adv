// To parse this data:
//
//   import { Convert, Profile } from "./file";
//
//   const profile = Convert.toProfile(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  province?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: Date;
  practiceSubareas?: PracticeSubareaElement[];
  subsectors?: Subsector[];
  languages?: LanguageElement[];
  interests?: Interest[];
  relevantOperations?: any[];
  workExperience?: any[];
  profilePicture?: null;
}

export interface Interest {
  id?: number;
  displayValue?: string;
}

export interface LanguageElement {
  id?: number;
  level?: Interest;
  language?: LanguageLanguage;
}

export interface LanguageLanguage {
  id?: number;
  name?: string;
  getNameDisplay?: string;
}

export interface PracticeSubareaElement {
  id?: number;
  practiceSubarea?: PracticeSubareaPracticeSubarea;
  getLevelDisplay?: GetLevelDisplay;
  level?: Level;
  subareaType?: SubareaType;
}

export enum GetLevelDisplay {
  Experto = "Experto",
  Intermedio = "Intermedio",
}

export enum Level {
  Expert = "expert",
  Intermediate = "intermediate",
}

export interface PracticeSubareaPracticeSubarea {
  id?: number;
  displayValue?: string;
  practiceArea?: Interest;
}

export enum SubareaType {
  Main = "main",
  Secondary = "secondary",
}

export interface Subsector {
  id?: number;
  displayValue?: string;
  sector?: Interest;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toProfile(json: string): Profile {
    return cast(JSON.parse(json), r("Profile"));
  }

  public static profileToJson(value: Profile): string {
    return JSON.stringify(uncast(value, r("Profile")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val
    )}`
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = ""
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Profile: o(
    [
      { json: "first_name", js: "firstName", typ: u(undefined, "") },
      { json: "last_name", js: "lastName", typ: u(undefined, "") },
      { json: "email", js: "email", typ: u(undefined, "") },
      { json: "phone", js: "phone", typ: u(undefined, "") },
      { json: "street", js: "street", typ: u(undefined, "") },
      { json: "city", js: "city", typ: u(undefined, "") },
      { json: "state", js: "state", typ: u(undefined, "") },
      { json: "province", js: "province", typ: u(undefined, "") },
      { json: "country", js: "country", typ: u(undefined, "") },
      { json: "zip_code", js: "zipCode", typ: u(undefined, "") },
      { json: "date_of_birth", js: "dateOfBirth", typ: u(undefined, Date) },
      {
        json: "practice_subareas",
        js: "practiceSubareas",
        typ: u(undefined, a(r("PracticeSubareaElement"))),
      },
      {
        json: "subsectors",
        js: "subsectors",
        typ: u(undefined, a(r("Subsector"))),
      },
      {
        json: "languages",
        js: "languages",
        typ: u(undefined, a(r("LanguageElement"))),
      },
      {
        json: "interests",
        js: "interests",
        typ: u(undefined, a(r("Interest"))),
      },
      {
        json: "relevant_operations",
        js: "relevantOperations",
        typ: u(undefined, a("any")),
      },
      {
        json: "work_experience",
        js: "workExperience",
        typ: u(undefined, a("any")),
      },
      {
        json: "profile_picture",
        js: "profilePicture",
        typ: u(undefined, null),
      },
    ],
    false
  ),
  Interest: o(
    [
      { json: "id", js: "id", typ: u(undefined, 0) },
      { json: "display_value", js: "displayValue", typ: u(undefined, "") },
    ],
    false
  ),
  LanguageElement: o(
    [
      { json: "id", js: "id", typ: u(undefined, 0) },
      { json: "level", js: "level", typ: u(undefined, r("Interest")) },
      {
        json: "language",
        js: "language",
        typ: u(undefined, r("LanguageLanguage")),
      },
    ],
    false
  ),
  LanguageLanguage: o(
    [
      { json: "id", js: "id", typ: u(undefined, 0) },
      { json: "name", js: "name", typ: u(undefined, "") },
      { json: "get_name_display", js: "getNameDisplay", typ: u(undefined, "") },
    ],
    false
  ),
  PracticeSubareaElement: o(
    [
      { json: "id", js: "id", typ: u(undefined, 0) },
      {
        json: "practice_subarea",
        js: "practiceSubarea",
        typ: u(undefined, r("PracticeSubareaPracticeSubarea")),
      },
      {
        json: "get_level_display",
        js: "getLevelDisplay",
        typ: u(undefined, r("GetLevelDisplay")),
      },
      { json: "level", js: "level", typ: u(undefined, r("Level")) },
      {
        json: "subarea_type",
        js: "subareaType",
        typ: u(undefined, r("SubareaType")),
      },
    ],
    false
  ),
  PracticeSubareaPracticeSubarea: o(
    [
      { json: "id", js: "id", typ: u(undefined, 0) },
      { json: "display_value", js: "displayValue", typ: u(undefined, "") },
      {
        json: "practice_area",
        js: "practiceArea",
        typ: u(undefined, r("Interest")),
      },
    ],
    false
  ),
  Subsector: o(
    [
      { json: "id", js: "id", typ: u(undefined, 0) },
      { json: "display_value", js: "displayValue", typ: u(undefined, "") },
      { json: "sector", js: "sector", typ: u(undefined, r("Interest")) },
    ],
    false
  ),
  GetLevelDisplay: ["Experto", "Intermedio"],
  Level: ["expert", "intermediate"],
  SubareaType: ["main", "secondary"],
};

import axios from "axios";
import { defineApp } from "./defineApp";

export function getLoomio(thing: { loomio: unknown }) {
  return (thing.loomio as LoomioApp)!;
}

const BASE_URL = "https://www.loomio.org";

const LoomioAppDef = defineApp({
  name: "loomio",
  version: "0.0.1",
  type: "app",
  props: {
    email: { type: "string" },
    password: { type: "string" },
    group_id: { type: "integer" },
    base_url: {
      type: "string",
      description: "Base url for loomio",
      default: BASE_URL
    }
  },
  methods: {
    getGroupId() {
      return this.group_id;
    },
    getBaseUrl() {
      return this.base_url || BASE_URL;
    },
    async getCookie() {
      const res = await axios.post(this.getBaseUrl() + "/api/v1/sessions", {
        user: {
          email: this.email,
          password: this.password,
        },
      });

      const headers = res.headers as Record<string, string[]>;

      return headers["set-cookie"]!.join("; ");
    },
  },
});

export type LoomioApp = typeof LoomioAppDef["methods"];

export default LoomioAppDef;

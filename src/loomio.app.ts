import axios from "axios";
import { defineApp } from "./defineApp";

const LoomioAppDef = defineApp({
  name: "loomio",
  version: "0.0.1",
  type: "app",
  props: {
    email: { type: "string" },
    password: { type: "string" },
  },
  methods: {
    async getCookie() {
      const res = await axios.post("https://www.loomio.org/api/v1/sessions", {
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

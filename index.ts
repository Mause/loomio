import { axios } from "@pipedream/platform";
import { defineComponent } from "ironpipe";
import FormData from "form-data";
import { AxiosError } from "axios";

function isAxiosError(e: any): e is AxiosError {
  return e.isAxiosError;
}

export default defineComponent({
  name: "loomio",
  version: "0.0.1",
  props: {
    username: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
  methods: {
    async getCookie($: any) {
      const fd = new FormData();
      fd.append("name", this.username as string);
      fd.append("email", this.email as string);
      fd.append("password", this.password as string);
      console.log(fd.getBuffer().toString());
      const res = await axios($, {
        method: "POST",
        url: "https://www.loomio.org/api/v1/sessions",
        data: fd,
        headers: fd.getHeaders(),
      });

      return res.cookies;
    },
  },
  async run({ $ }) {
    try {
      const cookies = await this.getCookie($);
      await axios($, {
        method: "POST",
        url: "https://www.loomio.org/api/v1/discussions",
        headers: { cookie: cookies },
      });
    } catch (e) {
      if (isAxiosError(e)) console.error(e.response?.data);
      throw e;
    }
  },
});

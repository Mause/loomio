import { axios } from "@pipedream/platform";
import { defineComponent } from "ironpipe";
import FormData from "form-data";

export default defineComponent({
  name: "loomio",
  version: "0.0.1",
  props: {
    username: { type: "string" },
  },
  methods: {
    async getCookie($: any) {
      const fd = new FormData();
      fd.append("username", this.username as string);
      fd.append("password", this.password as string);
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
      await axios($, {
        method: "POST",
        url: "https://www.loomio.org/api/v1/discussions",
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
});

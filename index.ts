import { defineComponent } from "ironpipe";
import axios from "axios";

export default defineComponent({
  name: "loomio",
  version: "0.0.1",
  props: {
    email: { type: "string" },
    password: { type: "string" },
    title: { type: "string" },
  },
  methods: {
    async getCookie($: any) {
      const res = await axios({
        method: "POST",
        url: "https://www.loomio.org/api/v1/sessions",
        data: {
          user: {
            email: this.email as string,
            password: this.password as string,
          },
        },
      });

      return res.headers["set-cookie"].join("; ");
    },
  },
  async run({ $ }): Promise<any> {
    const cookie = await this.getCookie($);
    const res = await axios({
      method: "POST",
      url: "https://www.loomio.org/api/v1/discussions",
      headers: { cookie },
      data: {
        discussion: {
          title: this.title,
        },
      },
    });
    return res.data.discussions[0];
  },
});

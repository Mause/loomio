import { defineComponent } from "ironpipe";
import axios from "axios";

interface ResponseShape {
  discussions: { title: string }[];
}

export default defineComponent({
  name: "loomio",
  version: "0.0.1",
  props: {
    email: { type: "string" },
    password: { type: "string" },
    title: { type: "string" },
  },
  methods: {
    async getCookie() {
      const res = await axios.post("https://www.loomio.org/api/v1/sessions", {
        user: {
          email: this.email ,
          password: this.password ,
        },
      });

      const headers = res.headers as Record<string, string[]>;

      return headers["set-cookie"]!.join("; ");
    },
  },
  async run({ $ }): Promise<any> {
    const cookie = await this.getCookie();
    const res = await axios.post<ResponseShape>(
      "https://www.loomio.org/api/v1/discussions",
      {
        discussion: {
          title: this.title,
        },
      },
      { headers: { cookie } }
    );
    return res.data.discussions[0];
  },
});

import { defineAction } from "ironpipe";
import axios from "axios";
import { LoomioApp } from "../loomio.app";
import { Discussion, ResponseShape } from "../types";

export default defineAction({
  key: "loomio-create-discussion",
  name: "Create Discussion",
  version: "0.0.2",
  type: "action",
  props: {
    loomio: { type: "app", app: "loomio" },
    title: { type: "string" },
    description: { type: "string" },
    description_format: { type: "string", options: ["md", "html"] },
  },
  methods: {},
  async run(): Promise<Discussion> {
    const loomio = (this.loomio as LoomioApp)!;
    const cookie = await loomio.getCookie();
    const group_id = loomio.getGroupId();

    const res = await axios.post<ResponseShape>(
      "https://www.loomio.org/api/v1/discussions",
      {
        discussion: {
          title: this.title,
          description: this.description,
          description_format: this.description_format,
          group_id,
          newest_first: false,
          private: true,
          notify_recipients: true,
          recipient_audience: `group-${group_id}`,
        },
      },
      { headers: { cookie } }
    );

    return res.data.discussions[0]!;
  },
});

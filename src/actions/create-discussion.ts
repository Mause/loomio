import { defineAction } from "ironpipe";
import axios from "axios";
import { Discussion, ResponseShape } from "../types";
import { getLoomio } from "../loomio.app";

export default defineAction({
  key: "loomio-create-discussion",
  name: "Create Discussion",
  description:
    "Creates a discussion thread in loomio in the group specified in the app",
  version: "0.0.2",
  type: "action",
  props: {
    loomio: { type: "app", app: "loomio" },
    title: { type: "string", label: "Discussion Title" },
    description: { type: "string", label: "Discussion description" },
    description_format: {
      type: "string",
      options: ["md", "html"],
      label: "Format of the description. Only supports a subset of markdown",
    },
  },
  methods: {},
  async run(): Promise<Discussion> {
    const loomio = getLoomio(this);
    const cookie = await loomio.getCookie();
    const group_id = loomio.getGroupId();

    const res = await axios.post<ResponseShape>(
      loomio.getBaseUrl() + "/api/v1/discussions",
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

import { axios } from "@pipedream/platform";
import { defineComponent } from "ironpipe";

export default defineComponent({
  name: "loomio",
  version: "0.0.1",
  props: {},
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

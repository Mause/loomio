import axios from "axios";
import { defineComponent } from "ironpipe";
import loomio, { LoomioApp } from "../loomio.app";
import { ResponseShape } from "../types";
import { DateTime, Duration } from "luxon";

export default defineComponent({
  name: "loomio-create-poll",
  version: "0.0.1",
  props: {
    loomio,
    title: { type: "string" },
    discussion_id: { type: "integer" },
  },
  async run() {
    const loomio = (this.loomio as LoomioApp)!;

    const cookie = await loomio.getCookie();

    const closing_at = DateTime.now()
      .plus(Duration.fromObject({ days: 3 }))
      .toISO();

    const res = await axios.post<ResponseShape>(
      "https://www.loomio.org/api/v1/polls",
      {
        poll: {
          title: this.title,
          details: "",
          details_format: "html",
          poll_type: "proposal",
          discussion_id: this.discussion_id,
          group_id: loomio.getGroupId(),
          closing_at,
          hide_results: "off",
          allow_long_reason: false,
          shuffle_options: false,
          notify_on_closing_soon: "undecided_voters",
          specified_voters_only: false,
          recipient_audience: null,
          recipient_message: null,
          tag_ids: [],
          notify_recipients: true,
          recipient_user_ids: [],
          recipient_chatbot_ids: [],
          recipient_emails: [],
          custom_fields: {
            minimum_stance_choices: null,
            max_score: null,
            min_score: null,
          },
          document_ids: [],
          poll_option_names: ["agree", "abstain", "disagree", "block"],
          link_previews: [],
          files: [],
          image_files: [],
        },
      },
      { headers: { cookie } }
    );

    return res.data.polls[0];
  },
});

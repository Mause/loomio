import { defineComponent } from "ironpipe";
import axios from "axios";
import loomio from "../loomio.app";
import { LoomioApp } from "../loomio.app";

type DateString = string;

interface Discussion {
  id: number;
  key: string;
  group_id: number;
  title: string;
  content_locale: null;
  description: string;
  description_format: "md";
  ranges: [];
  items_count: number;
  last_comment_at: null;
  last_activity_at: DateString;
  closed_at: null;
  seen_by_count: number;
  members_count: number;
  created_at: DateString;
  updated_at: DateString;
  private: true;
  versions_count: number;
  importance: number;
  pinned_at: null;
  attachments: [];
  link_previews: [];
  mentioned_usernames: [];
  newest_first: false;
  max_depth: number;
  discarded_at: null;
  secret_token: string;
  discussion_reader_id: number;
  discussion_reader_volume: "normal";
  discussion_reader_user_id: number;
  last_read_at: null;
  dismissed_at: null;
  read_ranges: [];
  revoked_at: null;
  inviter_id: number;
  admin: true;
  author_id: number;
  active_poll_ids: [];
  created_event_id: number;
  forked_event_id: null;
  tag_ids: [];
}

interface ResponseShape {
  discussions: Discussion[];
}

export default defineComponent({
  name: "loomio-create-discussion",
  version: "0.0.1",
  props: {
    loomio,
    group_id: { type: "number" },
    title: { type: "string" },
    description: { type: "text" },
  },
  methods: {},
  async run(): Promise<Discussion> {
    const cookie = await (this.loomio as LoomioApp)!.getCookie();
    const newLocal = await axios.post<ResponseShape>(
      "https://www.loomio.org/api/v1/discussions",
      {
        discussion: {
          title: this.title,
          description: this.description,
          description_format: "md",
          group_id: this.group_id,
          newest_first: false,
          private: true,
          notify_recipients: true,
          recipient_audience: `group-${this.group_id as string}`,
        },
      },
      { headers: { cookie } }
    );
    return newLocal.data.discussions[0]!;
  },
});

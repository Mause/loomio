export type DateString = string;

export interface Discussion {
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

export interface Poll {
  discussion_id: number;
}

export interface ResponseShape {
  discussions: Discussion[];
  polls: Poll[];
}

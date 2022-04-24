import dotenv from "dotenv";
import CreateDiscussion from "./actions/create-discussion";
import CreatePoll from "./actions/create-poll";
import { createApp, createAction, createComponent } from "./create-component";
import LoomioApp, { BASE_URL } from "./loomio.app";
import { Discussion, Poll } from "./types";
import { catchError } from "./utils";

const config = dotenv.config();

const title = "Title: Prof";

async function main() {
  const parsed = config.parsed!;

  const loomio = createApp(LoomioApp, {
    email: parsed["EMAIL"]!,
    password: parsed["PASSWORD"]!,
    group_id: parseInt(parsed["GROUP_ID"]!, 10),
    base_url: BASE_URL
  });

  const createDiscussion = createAction(CreateDiscussion, {
    loomio,
    description_format: "html",
    description: `<h1>Describe</h1>

<blockquote>quote me at your peril</blockquote>`,
    title,
  });

  const disc = (await createDiscussion.run()) as Discussion;

  console.log(JSON.stringify(disc, undefined, 2));

  const createPoll = createAction(CreatePoll, {
    loomio,
    title,
    discussion_id: disc.id,
  });

  const poll = (await createPoll.run()) as Poll;

  console.log(JSON.stringify(poll, undefined, 2));
}

if (require.main === module) {
  catchError(main).then(
    () => process.exit(),
    (error) => console.error(error)
  );
}

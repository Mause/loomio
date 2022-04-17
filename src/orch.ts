import dotenv from "dotenv";
import CreateDiscussion from "./actions/create-discussion";
import { createApp, createComponent } from "./create-component";
import LoomioApp from "./loomio.app";

const config = dotenv.config();

async function main() {
  const parsed = config.parsed!;

  const loomio = createApp(LoomioApp, {
    email: parsed["EMAIL"],
    password: parsed["PASSWORD"],
  });

  const createDiscussion = createComponent(CreateDiscussion, {
    loomio,
    description: `# Describe

> quote me at your peril`,
    group_id: parsed["GROUP_ID"],
    title: "Title: Prof",
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const res = (await createDiscussion.run({ $: {} })) as unknown;

  console.log(JSON.stringify(res, undefined, 2));
}

if (require.main === module) {
  main().then(
    () => process.exit(),
    (error) => console.error(error)
  );
}

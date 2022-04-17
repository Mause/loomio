import moxios from "moxios";
import LoomioApp from "../src/loomio.app";
import comp from "../src/actions/create-discussion";
import { createApp, createComponent } from "../src/create-component";
import { Discussion } from "../src/types";

const title = "this is a title";

beforeEach(() => moxios.install());
afterEach(() => moxios.uninstall());
it("boop", async () => {
  moxios.stubRequest(/sessions/, {
    status: 200,
    response: {},
    headers: {
      "set-cookie": ["token=token", "dummy"],
    },
  });
  moxios.stubRequest(/discussions/, {
    status: 200,
    response: {
      discussions: [
        {
          title,
        },
      ],
    },
  });

  const loomio = createApp(LoomioApp, {
    email: "dummy@example.com",
    group_id: 1,
    password: "password",
  });

  const createDiscussion = createComponent(comp, {
    loomio,
    description_format: "md",
    description: "this is a description",
    title,
  });

  const disc = (await createDiscussion.run({ $: {} })) as Discussion;

  expect(disc).toEqual({ title });
});

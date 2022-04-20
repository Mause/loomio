import moxios from "moxios";
import LoomioApp from "../src/loomio.app";
import CreateDiscussion from "../src/actions/create-discussion";
import { createApp, createAction } from "../src/create-component";
import { Discussion, Poll } from "../src/types";
import CreatePoll from "../src/actions/create-poll";

const title = "this is a title";

describe("loomio", () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());
  it("basics work correctly", async () => {
    expect.hasAssertions();
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
            id: 1,
            title,
          },
        ],
      },
    });
    moxios.stubRequest(/polls/, {
      status: 200,
      response: { polls: [{ id: 0 }] },
    });

    const loomio = createApp(LoomioApp, {
      email: "dummy@example.com",
      group_id: 1,
      password: "password",
    });

    const createDiscussion = createAction(CreateDiscussion, {
      loomio,
      description_format: "md",
      description: "this is a description",
      title,
    });

    const disc = (await createDiscussion.run()) as Discussion;

    expect(disc).toStrictEqual({ id: 1, title });

    const createPoll = createAction(CreatePoll, {
      loomio,
      title,
      discussion_id: disc.id,
    });

    const poll = (await createPoll.run()) as Poll;

    expect(poll).toStrictEqual({ id: 0 });
  });
});

import comp from "../index";
import moxios from "moxios";
import { createComponent } from "../src/create-component";

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

  const disc = await createComponent(comp, {
    email: "dummy@example.com",
    password: "password",
    title,
  }).run({ $: {} });

  expect(disc).toEqual({ title });
});

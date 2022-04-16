import comp from "../index";
import moxios from "moxios";

beforeEach(() => moxios.install());
afterEach(() => moxios.uninstall());
it("boop", async () => {
  moxios.stubRequest(/discussions/, { status: 200, response: {} });
  await comp.run({ $: {} });
});

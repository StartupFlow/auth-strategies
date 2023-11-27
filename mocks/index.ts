import { setupServer } from "msw/node";

import { handlers as resendHandlers } from "./resend";

export const mockedServer = setupServer(...resendHandlers);

export const startAndStopMockedServer = () => {
  mockedServer.listen();
  return () => mockedServer.close();
};

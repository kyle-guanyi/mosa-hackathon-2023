import "/styles/globals.css";

import Nav from "components/Nav";
import Provider from "components/Provider";

export const metadata = {
  title: "Founding Friends",
  description: "Meetup web application for MCIT Online students",
};

const EventLayout = ({ children }) => {
  return (
      <body>
        <Provider>
        <Nav/>
        <main className="flex items-center justify-center">
          {children}
        </main>
        </Provider>
      </body>
  );
};

export default EventLayout;

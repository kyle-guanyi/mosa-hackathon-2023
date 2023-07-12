import "/styles/globals.css";

import Nav from "components/Nav";
import Provider from "components/Provider";

export const metadata = {
  title: "Founding Friends",
  description: "Meetup web application for MCIT Online students",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
        <Nav/>
        <main className="mx-auto fixed inset-0 flex items-center justify-center pointer-events-none">
          {children}
        </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;

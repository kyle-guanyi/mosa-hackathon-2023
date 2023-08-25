// "use client"

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
      <body >
        <Provider>
          <header className="sticky top-0 z-50">
            <div className="w-full">
              <Nav />
            </div>
          </header>
          <main className="main flex-col">{children}</main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;

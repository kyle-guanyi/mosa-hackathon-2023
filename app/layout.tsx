// @ts-nocheck
import "/styles/globals.css";
import Nav from "components/Nav";
import Provider from "components/Provider";

/**
 * This is the root layout for the entire application.
 */
export const metadata = {
  title: "Founding Friends",
  description: "Meetup web application for MCIT Online students",
};

// This is the root layout for the entire application.
const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="100vh v-full">
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

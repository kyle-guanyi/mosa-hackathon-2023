import "/styles/globals.css";

import Nav from "components/Nav";
import Provider from "components/Provider";

export const metadata = {
  title: "Founding Friends",
  description: "Meetup web application for MCIT Online students",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <Provider>
        <main className='app'>
          <Nav />
          {children}
        </main>
      </Provider>
    </body>
  </html>
);


export default RootLayout;

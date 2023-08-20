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
    <html lang='en'>
      <body>
        <Provider>
          <Nav className='fixed' />
          <main className='main flex-col'>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};


export default RootLayout;

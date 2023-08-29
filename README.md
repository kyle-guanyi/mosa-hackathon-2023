# mosa-hackathon-2023

# Founding Friends
![Founding Friends Slides](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/a8a73f79-7185-426d-8606-c8a9d089ced6)


## Overview

### Project summary

Founding Friends is designed by MCIT online students for UPenn students. The website provides an intuitive portal for students to create events and sign-up to attend in-person and virtual events. The website uses the UPenn email to login so that only UPenn students can sign-up for event. Each event page allows students to efficiently share Zoom meetings links for virtual meetings and photos from the event. Once logged in, students can filter for events in their area, or on a certain date. Students can create a profile to share a brief bio, their interests, and which classes they have completed. 

Include the link to your Devpost project page here: [Devpost](https://devpost.com/software/founding-friends)]

### Authors

* Kyle Li - kyle-guanyi – kyleli@seas.upenn.edu – [GitHub](https://github.com/kyle-guanyi)
* Kevin Nguyen - kevinocca – kebin@seas.upenn.edu – [GitHub](https://github.com/kebinjpeg)
* Bonnie Tse - bonniet – Penn email – [GitHub](https://github.com/bonniewt)

## Usage

This section walks a prospective user through the process of installing and running the project on their local machine. The more detailed and the more accurate, the better. User-friendly instructions will entice prospective users (including judges) to engage more deeply with your project, which could improve your hackathon score.

### Prerequisites

* [WebStorm](https://www.jetbrains.com/webstorm/) - JavaScript IDE* [PhpStorm]((https://www.jetbrains.com/phpstorm/)) - JavaScript IDE (choose IDE of your preference)
* [VS Code](https://code.visualstudio.com/) - JavaScript IDE (choose IDE of your preference)
* [Node.js](https://nodejs.org/en/download/) - JavaScript Framework
```
Provide code samples in this fenced code block.
```

### Installation

Give a step-by-step rundown of how to **install** your project.

Step 1: Download IDE of your preference

* [PhpStorm]((https://www.jetbrains.com/phpstorm/)) - JavaScript IDE (choose IDE of your preference)
* [VS Code](https://code.visualstudio.com/) - JavaScript IDE (choose IDE of your preference)

Step 2: Download Node.js (version > 16.10)

https://nodejs.org/en/download/

Step 3: Download required packages

Check the version of npm you have

``` npm -v ```

If you don't have npm installed, you can install the lastest version of npm using the following command

```npm install -g npm```

Install the icons from React.js 

```npm install react-icons@latest --save```

```npm install react-calendar@latest``` 

Install AWS Software Development Kit

```npm install aws-sdk@latest @aws-sdk/s3-request-presigner@latest @aws-sdk/client-s3@latest --save```

Install Chakra UI packages

```npm install chakra-ui@latest @chakra-ui/react@latest @chakra-ui/icons@latest @chakra-ui/next-js@latest```

Install emotion/react for styling in React

```npm install @emotion/react @emotion/styledn```

Install React.js package

```npm install react-dropzone@latest``` 

```npm install react-select@latest```

Install Framer package

```npm install framer-motion@latest``` 

Install Tailwind CSS package

```npm install tailwindcss@latest```

Install Axios package for HTTp client

```npm install axios@latest```

Install MongoDB

```npm install mongodb@latest```

Install Mongoose pacakge for MongoDB

```npm install mongoose@latest``` 

Install Next-Auth for login authentication

```npm install next-auth@latest```

Install Next.js

```npm install next@latest```

Install Luxon library for dates and time for JavaScript

```npm install luxon@latest```

### Deployment

Give a step-by-step rundown of how to **use** your project. Including screenshots in this section can be highly effective for highlighting specific features of your project.

State step 1.

Download the code from [mosa-hackathon-2023](https://github.com/kyle-guanyi/mosa-hackathon-2023)

State step 2.

Load the code into your IDE. 

Step 3:
In the terminal, type `npm run dev` to run the code.

Step 4: 

In the web browser of your choice, navigate to `localhost:3000`

Step 5: 

Step 9: To terminate localhost, in the Terminal type "Control + C"

Welcome Page - http://localhost:3000
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/e9eb2149-c9b7-4a20-975a-0cf743457ab2)

About Page
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/1f2a127b-b485-4261-a7f2-e362ba2b32fe)

Login Page using Google and restricted to seas.upenn.edu emails only
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/ff4cc641-1e66-4073-a2b9-37c1018b9185)

Event Home Page
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/cc99f5e8-82bd-46a3-bbc5-a565b373484d)

Profile Page
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/d6291d0a-77a1-4192-b5a6-d5358d96f219)

Edit Profile Page
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/a3351919-dacb-4994-8d01-fa5d7be47bc3)

Create New Event Page
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/a187d386-4d41-4765-85d3-0659bd902338)

Event Home Page - Filtered
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/fe3afef4-cd9d-4901-bbcd-1c340f6b5eb9)

Event Page
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/853dd0cb-5858-45c5-aff9-32c8bc8f2942)

Event Discussion Board
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/dba51669-8ceb-432c-a485-151eb92e1ced)

Sign Out
![image](https://github.com/kyle-guanyi/mosa-hackathon-2023/assets/70975465/d92fa765-c844-4d86-a418-78a1ba6982d4)


## Additional information

### Tools used

Which frameworks, libraries, or other tools did you use to create your project?

* [Node.js](https://nodejs.org/en/about/) - Server Environment
* [MongoDB](https://www.mongodb.com/) - NoSQL Database
* [Next.js](https://nextjs.org/) - Web Development Framework w/ Server-side Rendering
* [React.js](https://reactjs.org/) - Web Development Library
* [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
* [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
* [react-dropzone](https://react-dropzone.js.org/) - React hook to create a HTML5-compliant drag and drop zone for files
* [Mongoose](https://www.npmjs.com/package/mongoose) - Database MongoDB Object Modeling Tool
* [Luxon Library](https://www.npmjs.com/package/luxon) - Library for working with dates and times in JavaScript
* [Framer](https://www.framer.com/about/) - Javascript library for web
* [Axios](https://axios-http.com/) - HTTP Request Utility
* [Amazon Web Services Software Development Kit](https://aws.amazon.com/developer/tools/) - S3 buckets for storing images
* [Google API](https://cloud.google.com/?hl=en) - Google API for user login for Upenn email accounts only


### License

MIT License

Copyright (c) 2023 Founding-Fathers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

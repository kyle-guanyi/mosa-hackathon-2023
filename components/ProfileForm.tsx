import Link from "next/link";
import Dropdown from "./Dropdown";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";

// @ts-ignore
const ProfileForm = ({ type, user, setUser, submitting, handleSubmit }) => {
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post </span>
      </h1>
      <p className="desc text-left max-w-md">{type} your profile here.</p>
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >

          {/*Prefill with first name from UPenn email but user can manually update*/}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            First Name
          </span>
          <input
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            placeholder="Update your first name here..." //TODO prefill with first name from upenn email
            required
            className="form_input"
          />
        </label>

          {/*Prefill with last name from UPenn email but user can manually update*/}
          <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Last Name
          </span>
              <input
                  value={user.lastName}
                  onChange={(e) => setUser({ ...event, eventName: e.target.value })}
                  placeholder="Update your last name here..." // TODO prefill with last name from upenn email
                  required
                  className="form_input"
              />
          </label>

          {/*User selects closest city/country/region from dropdown menu*/}
          <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Closest City
          </span>
              <Dropdown
                  options={["Africa", "Alberta", "Atlanta", "Austin", "Australia", "Bay Area", "Berlin", "Boston", "CDMX", "Chicago",
                      "China", "Connecticut", "DC", "Colorado", "DFW", "Europe", "Florida", "Hong Kong", "Houston", "India",
                      "Indonesia", "Japan", "Korea", "Latin America", "London", "Los Angeles", "Midwest", "Montreal", "Nankai",
                      "New Jersey", "New Zealand", "NYC", "Philippines", "Philly", "Portland PDX", "Salt Lake City", "Seattle",
                      "Singapore", "Toronto", "Vancouver", "Vietnam"]}
                  selected={user.closestMainCity}
                  onSelectedChange={(value) => setUser({ ...user, closestMainCity: value })}
              />
          </label>

          {/*User selects gender from dropdown menu*/}
          <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Gender
          </span>
              <Dropdown
                  options={["Male", "Female", "Decline to Answer"]}
                  selected={user.gender}
                  onSelectedChange={(value) => setUser({ ...user, gender: value })}
              />
          </label>


        {/*User update bio (optional)*/}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Tell us about yourself!
          </span>
          <textarea
            value={user.bio}
            onChange={(e) =>
              setUser({ ...user, bio: e.target.value })
            }
            placeholder="Write your brief bio here..."
            required
            className="form_textarea"
          />
        </label>

          {/*Multi-select for classes taken*/}
          <label>
            <span className="font-satoshi font-semibold text-base text-gray-700">
            Classes Taken (including current classes)
            </span>
              <MultiSelectDropdown
                  options={["CIT 5910 Introduction to Software Development",
                      "CIT 5920 Mathematical Foundations of Computer Science",
                      "CIT 5930 Introduction to Computer Systems",
                      "CIT 5940 Data Structures and Software Design",
                      "CIT 5950 Computer Systems Programming",
                      "CIT 5960 Algorithms and Computation",
                      "CIT 5150 Fundamentals of Linear Algebra and Optimization",
                      "CIT 5210 Artificial Intelligence",
                      "CIS 5450 Big Data Analytics",
                      "CIT 547 Software Analysis",
                      "CIT 5490 Wireless Communications for Mobile Networks and Internet of Things",
                      "CIS 5500 Database and Information Systems",
                      "CIS 5510 Computer and Network Security",
                      "CIS 5530 Networked Systems",
                      "CIS 5550 Internet and Web Systems",
                      "CIS 5810 Computer Vision and Computational Photography",
                      "CIT 5820 Blockchains and Cryptography",
                      "DATS 5750 Cloud Technologies Practicum",
                      "ESE 5410 Machine Learning for Data Science",
                      "ESE 5420 Statistics for Data Science",
                      "ESE 5460 Principles of Deep Learning"
                  ]}
                  selected={user.classesTaken}
                  onSelectedChange={(values) => setUser({ ...user, classesTaken: values })}
              />
          </label>

          {/*Multi-select for field(s) of interest*/}
          <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Field(s) of Interest
          </span>
              <MultiSelectDropdown
                  options={[
                      "Cybersecurity",
                      "Data Science",
                      "Machine Learning",
                      "Software Engineering",
                      "Blockchain",
                      "Artificial Intelligence",
                      "Computer Vision",
                      "Augmented Reality (AR) & Virtual Reality (VR)",
                      "Internet of Things (IoT)",
                      "Big Data",
                      "Cloud Computing",
                      "Wireless Communications",
                      "Biotechnology",
                      "Robotics & Automation",
                      "Edge Computing",
                      "FinTech",
                      "HealthTech",
                      "EdTech",
                      "SpaceTech",
                      "Quantum Computing",
                      "Green & Sustainable Technologies",
                      "Human Augmentation",
                      "3D Printing",
                      "Serverless Computing",
                      "Wearable Tech",
                      "Drones & UAVs (Unmanned Aerial Vehicles)",
                  ]}
                  selected={user.fieldOfInterest}
                  onSelectedChange={(values) => setUser({ ...user, fieldOfInterest: values })}
              />
          </label>

        {/*Dropdown menu select Time Zone*/}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Time Zone (Required)
          </span>
          <Dropdown
              options={[
                    "UTC-12:00 - International Date Line West (IDLW)",
                    "UTC-11:00 - Niue Time (NUT), Samoa Standard Time (SST)",
                    "UTC-10:00 - Hawaii-Aleutian Standard Time (HAST)",
                    "UTC-09:30 - Marquesas Islands Time (MART)",
                    "UTC-09:00 - Alaska Standard Time (AKST)",
                    "UTC-08:00 - Pacific Standard Time (PST)",
                    "UTC-07:00 - Mountain Standard Time (MST)",
                    "UTC-06:00 - Central Standard Time (CST)",
                    "UTC-05:00 - Eastern Standard Time (EST)",
                    "UTC-04:00 - Atlantic Standard Time (AST)",
                    "UTC-03:30 - Newfoundland Standard Time (NST)",
                    "UTC-03:00 - Amazon Standard Time (AMT)",
                    "UTC-02:00 - Fernando de Noronha Time (FNT)",
                    "UTC-01:00 - Azores Standard Time (AZOST)",
                    "UTC+00:00 - Greenwich Mean Time (GMT)",
                    "UTC+01:00 - Central European Time (CET)",
                    "UTC+02:00 - Eastern European Time (EET)",
                    "UTC+03:00 - Moscow Standard Time (MSK)",
                    "UTC+03:30 - Iran Standard Time (IRST)",
                    "UTC+04:00 - Gulf Standard Time (GST)",
                    "UTC+04:30 - Afghanistan Time (AFT)",
                    "UTC+05:00 - Pakistan Standard Time (PKT)",
                    "UTC+05:30 - Indian Standard Time (IST)",
                    "UTC+05:45 - Nepal Time (NPT)",
                    "UTC+06:00 - Bangladesh Time (BST)",
                    "UTC+06:30 - Myanmar Time (MMT)",
                    "UTC+07:00 - Indochina Time (ICT)",
                    "UTC+08:00 - China Standard Time (CST)",
                    "UTC+08:45 - Southeastern Western Australia Standard Time (CWST)",
                    "UTC+09:00 - Japan Standard Time (JST)",
                    "UTC+09:30 - Australian Central Standard Time (ACST)",
                    "UTC+10:00 - Japan Standard Time(JST), Korea Standard Time (KST)",
                    "UTC+10:30 - Lord Howe Standard Time (LHST)",
                    "UTC+11:00 - Solomon Islands Time (SBT)",
                    "UTC+11:30 - Norfolk Island Time (NFT)",
                    "UTC+12:00 - New Zealand Standard Time (NZST)",
                    "UTC+12:45 - Chatham Standard Time (CHAST)",
                    "UTC+13:00 - Tonga Time (TOT)",
                    "UTC+14:00 - Line Island Time (LINT)",
                  ]}
              selected={user.timeZone}
              onSelectedChange={(value) => setUser({ ...user, timeZone: value })}
          />
          </label>

        {/*Cancel button*/}
        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/profile" className="text-gray-500 text-sm">
            Cancel
          </Link>

          {/*Submit button*/}
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileForm;

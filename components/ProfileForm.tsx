import Link from "next/link";
import Dropdown from "./Dropdown";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import Select from "react-select";

const ClosestCity = [
  { value: "Africa", label: "Africa" },
  { value: "Alberta", label: "Alberta" },
  { value: "Atlanta", label: "Atlanta" },
  { value: "Austin", label: "Austin" },
  { value: "Australia", label: "Australia" },
  { value: "Bay Area", label: "Bay Area" },
  { value: "Berlin", label: "Berlin" },
  { value: "Boston", label: "Boston" },
  { value: "CDMX", label: "CDMX" },
  { value: "Chicago", label: "Chicago" },
  { value: "China", label: "China" },
  { value: "Connecticut", label: "Connecticut" },
  { value: "DC", label: "DC" },
  { value: "Colorado", label: "Colorado" },
  { value: "DFW", label: "DFW" },
  { value: "Europe", label: "Europe" },
  { value: "Florida", label: "Florida" },
  { value: "Hong Kong", label: "Hong Kong" },
  { value: "Houston", label: "Houston" },
  { value: "India", label: "India" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Japan", label: "Japan" },
  { value: "Korea", label: "Korea" },
  { value: "Latin America", label: "Latin America" },
  { value: "London", label: "London" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Midwest", label: "Midwest" },
  { value: "Montreal", label: "Montreal" },
  { value: "Nankai", label: "Nankai" },
  { value: "New Jersey", label: "New Jersey" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "NYC", label: "NYC" },
  { value: "Philippines", label: "Philippines" },
  { value: "Philly", label: "Philly" },
  { value: "Portland PDX", label: "Portland PDX" },
  { value: "Salt Lake City", label: "Salt Lake City" },
  { value: "Seattle", label: "Seattle" },
  { value: "Singapore", label: "Singapore" },
  { value: "Toronto", label: "Toronto" },
  { value: "Vancouver", label: "Vancouver" },
  { value: "Vietnam", label: "Vietnam" },
];

const Gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Decline to Answer", label: "Decline to Answer" },
];

const classesTaken = [
  {
    value: "CIT 5910 Introduction to Software Development",
    label: "CIT 5910 Introduction to Software Development",
  },
  {
    value: "CIT 5920 Mathematical Foundations of Computer Science",
    label: "CIT 5920 Mathematical Foundations of Computer Science",
  },
  {
    value: "CIT 5930 Introduction to Computer Systems",
    label: "CIT 5930 Introduction to Computer Systems",
  },
  {
    value: "CIT 5940 Data Structures and Software Design",
    label: "CIT 5940 Data Structures and Software Design",
  },
  {
    value: "CIT 5950 Computer Systems Programming",
    label: "CIT 5950 Computer Systems Programming",
  },
  {
    value: "CIT 5960 Algorithms and Computation",
    label: "CIT 5960 Algorithms and Computation",
  },
  {
    value: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
    label: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
  },
  {
    value: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
    label: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
  },
  {
    value: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
    label: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
  },
  {
    value: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
    label: "CIT 5150 Fundamentals of Linear Algebra and Optimization",
  },
  {
    value: "CIT 5210 Artificial Intelligence",
    label: "CIT 5210 Artificial Intelligence",
  },
  {
    value: "CIS 5450 Big Data Analytics",
    label: "CIS 5450 Big Data Analytics",
  },
  { value: "CIT 547 Software Analysis", label: "CIT 547 Software Analysis" },
  {
    value:
      "CIT 5490 Wireless Communications for Mobile Networks and Internet of Things",
    label:
      "CIT 5490 Wireless Communications for Mobile Networks and Internet of Things",
  },
  {
    value: "CIS 5500 Database and Information Systems",
    label: "CIS 5500 Database and Information Systems",
  },
  {
    value: "CIS 5510 Computer and Network Security",
    label: "CIS 5510 Computer and Network Security",
  },
  { value: "CIS 5530 Networked Systems", label: "CIS 5530 Networked Systems" },
  {
    value: "CIS 5550 Internet and Web Systems",
    label: "CIS 5550 Internet and Web Systems",
  },
  {
    value: "CIS 5810 Computer Vision and Computational Photography",
    label: "CIS 5810 Computer Vision and Computational Photography",
  },
  {
    value: "CIT 5820 Blockchains and Cryptography",
    label: "CIT 5820 Blockchains and Cryptography",
  },
  {
    value: "DATS 5750 Cloud Technologies Practicum",
    label: "DATS 5750 Cloud Technologies Practicum",
  },
  {
    value: "ESE 5410 Machine Learning for Data Science",
    label: "ESE 5410 Machine Learning for Data Science",
  },
  {
    value: "ESE 5420 Statistics for Data Science",
    label: "ESE 5420 Statistics for Data Science",
  },
  {
    value: "ESE 5460 Principles of Deep Learning",
    label: "ESE 5460 Principles of Deep Learning",
  },
];

const InterestFields = [
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Data Science", label: "Data Science" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "Computer Vision", label: "Computer Vision" },
  {
    value: "Augmented Reality (AR) & Virtual Reality (VR)",
    label: "Augmented Reality (AR) & Virtual Reality (VR)",
  },
  { value: "Internet of Things (IoT)", label: "Internet of Things (IoT)" },
  { value: "Big Data", label: "Big Data" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "Wireless Communications", label: "Wireless Communications" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Robotics & Automation", label: "Robotics & Automation" },
  { value: "Edge Computing", label: "Edge Computing" },
  { value: "FinTech", label: "FinTech" },
  { value: "HealthTech", label: "HealthTech" },
  { value: "EdTech", label: "EdTech" },
  { value: "SpaceTech", label: "SpaceTech" },
  { value: "Quantum Computing", label: "Quantum Computing" },
  {
    value: "Green & Sustainable Technologies",
    label: "Green & Sustainable Technologies",
  },
  { value: "Human Augmentation", label: "Human Augmentation" },
  { value: "3D Printing", label: "3D Printing" },
  { value: "Serverless Computing", label: "Serverless Computing" },
  { value: "Wearable Tech", label: "Wearable Tech" },
  {
    value: "Drones & UAVs (Unmanned Aerial Vehicles)",
    label: "Drones & UAVs (Unmanned Aerial Vehicles)",
  },
];

const Timezones = [
  {
    value: "UTC-12:00 - International Date Line West (IDLW)",
    label: "UTC-12:00 - International Date Line West (IDLW)",
  },
  {
    value: "UTC-11:00 - Niue Time (NUT), Samoa Standard Time (SST)",
    label: "UTC-11:00 - Niue Time (NUT), Samoa Standard Time (SST)",
  },
  {
    value: "UTC-09:30 - Marquesas Islands Time (MART)",
    label: "UTC-09:30 - Marquesas Islands Time (MART)",
  },
  {
    value: "UTC-09:00 - Alaska Standard Time (AKST)",
    label: "UTC-09:00 - Alaska Standard Time (AKST)",
  },
  {
    value: "UTC-08:00 - Pacific Standard Time (PST)",
    label: "UTC-08:00 - Pacific Standard Time (PST)",
  },
  {
    value: "UTC-07:00 - Mountain Standard Time (MST)",
    label: "UTC-07:00 - Mountain Standard Time (MST)",
  },
  {
    value: "UTC-06:00 - Central Standard Time (CST)",
    label: "UTC-06:00 - Central Standard Time (CST)",
  },
  {
    value: "UTC-05:00 - Eastern Standard Time (EST)",
    label: "UTC-05:00 - Eastern Standard Time (EST)",
  },
  {
    value: "UTC-04:00 - Atlantic Standard Time (AST)",
    label: "UTC-04:00 - Atlantic Standard Time (AST)",
  },
  {
    value: "UTC-03:30 - Newfoundland Standard Time (NST)",
    label: "UTC-03:30 - Newfoundland Standard Time (NST)",
  },
  {
    value: "UTC-03:00 - Amazon Standard Time (AMT)",
    label: "UTC-03:00 - Amazon Standard Time (AMT)",
  },
  {
    value: "UTC-02:00 - Fernando de Noronha Time (FNT)",
    label: "UTC-02:00 - Fernando de Noronha Time (FNT)",
  },
  {
    value: "UTC-01:00 - Azores Standard Time (AZOST)",
    label: "UTC-01:00 - Azores Standard Time (AZOST)",
  },
  {
    value: "UTC+00:00 - Greenwich Mean Time (GMT)",
    label: "UTC+00:00 - Greenwich Mean Time (GMT)",
  },
  {
    value: "UTC+01:00 - Central European Time (CET)",
    label: "UTC+01:00 - Central European Time (CET)",
  },
  {
    value: "UTC+02:00 - Eastern European Time (EET)",
    label: "UTC+02:00 - Eastern European Time (EET)",
  },
  {
    value: "UTC+03:00 - Moscow Standard Time (MSK)",
    label: "UTC+03:00 - Moscow Standard Time (MSK)",
  },
  {
    value: "UTC+03:30 - Iran Standard Time (IRST)",
    label: "UTC+03:30 - Iran Standard Time (IRST)",
  },
  {
    value: "UTC+04:00 - Gulf Standard Time (GST)",
    label: "UTC+04:00 - Gulf Standard Time (GST)",
  },
  {
    value: "UTC+04:30 - Afghanistan Time (AFT)",
    label: "UTC+04:30 - Afghanistan Time (AFT)",
  },
  {
    value: "UTC+05:00 - Pakistan Standard Time (PKT)",
    label: "UTC+05:00 - Pakistan Standard Time (PKT)",
  },
  {
    value: "UTC+05:30 - Indian Standard Time (IST)",
    label: "UTC+05:30 - Indian Standard Time (IST)",
  },
  {
    value: "UTC+05:45 - Nepal Time (NPT)",
    label: "UTC+05:45 - Nepal Time (NPT)",
  },
  {
    value: "UTC+06:00 - Bangladesh Time (BST)",
    label: "UTC+06:00 - Bangladesh Time (BST)",
  },
  {
    value: "UTC+06:30 - Myanmar Time (MMT)",
    label: "UTC+06:30 - Myanmar Time (MMT)",
  },
  {
    value: "UTC+07:00 - Indochina Time (ICT)",
    label: "UTC+07:00 - Indochina Time (ICT)",
  },
  {
    value: "UTC+08:00 - China Standard Time (CST)",
    label: "UTC+08:00 - China Standard Time (CST)",
  },
  {
    value: "UTC+08:45 - Southeastern Western Australia Standard Time (CWST)",
    label: "UTC+08:45 - Southeastern Western Australia Standard Time (CWST)",
  },
  {
    value: "UTC+09:00 - Japan Standard Time (JST)",
    label: "UTC+09:00 - Japan Standard Time (JST)",
  },
  {
    value: "UTC+09:30 - Australian Central Standard Time (ACST)",
    label: "UTC+09:30 - Australian Central Standard Time (ACST)",
  },
  {
    value: "UTC+10:00 - Japan Standard Time(JST), Korea Standard Time (KST)",
    label: "UTC+10:00 - Japan Standard Time(JST), Korea Standard Time (KST)",
  },
  {
    value: "UTC+10:30 - Lord Howe Standard Time (LHST)",
    label: "UTC+10:30 - Lord Howe Standard Time (LHST)",
  },
  {
    value: "UTC+11:00 - Solomon Islands Time (SBT)",
    label: "UTC+11:00 - Solomon Islands Time (SBT)",
  },
  {
    value: "UTC+11:30 - Norfolk Island Time (NFT)",
    label: "UTC+11:30 - Norfolk Island Time (NFT)",
  },
  {
    value: "UTC+12:00 - New Zealand Standard Time (NZST)",
    label: "UTC+12:00 - New Zealand Standard Time (NZST)",
  },
  {
    value: "UTC+12:45 - Chatham Standard Time (CHAST)",
    label: "UTC+12:45 - Chatham Standard Time (CHAST)",
  },
  {
    value: "UTC+13:00 - Tonga Time (TOT)",
    label: "UTC+13:00 - Tonga Time (TOT)",
  },
  {
    value: "UTC+14:00 - Line Island Time (LINT)",
    label: "UTC+14:00 - Line Island Time (LINT)",
  },
];

// @ts-ignore
const ProfileForm = ({ type, user, setUser, submitting, handleSubmit }) => {
  // const [selectedOptions, setSelectedOptions] = useState([]);

  // const handleMultiSelectChange = (selectedOptions) => {
  //   setSelectedOptions(selectedOptions);
  // };
  
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Profile </span>
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
          <Select
            options={ClosestCity}
            onChange={(selectedOption) =>
              setUser({ ...user, closestMainCity: selectedOption.value })
            }
          />
        </label>

        {/*User selects gender from dropdown menu*/}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Gender
          </span>
          <Select
            options={Gender}
            onChange={(selectedOption) =>
              setUser({ ...user, gender: selectedOption.value })
            }
          />
        </label>

        {/*User update bio (optional)*/}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Tell us about yourself!
          </span>
          <textarea
            value={user.bio}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
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
          <Select
            options={classesTaken}
            closeMenuOnSelect={false}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(option => option.value);
              setUser({ ...user, classesTaken: selectedValues });
            }}
            isMulti
          />
        </label>

        {/*Multi-select for field(s) of interest*/}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Field(s) of Interest
          </span>
          <Select
            options={InterestFields}
            closeMenuOnSelect={false}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(option => option.value);
              setUser({ ...user, fieldOfInterest: selectedValues });
            }}
            isMulti 
          />
        </label>

        {/*Dropdown menu select Time Zone*/}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Time Zone (Required)
          </span>
          <Select
            options={Timezones}
            onChange={(selectedOption) =>
              setUser({ ...user, timeZone: selectedOption.value })
            }
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

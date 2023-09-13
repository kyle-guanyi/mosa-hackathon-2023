// @ts-nocheck
import Select from "react-select";
import Dropzone from "components/Dropzone";
import React, { useState, useEffect } from "react";

import {
  Stack,
  Box,
  FormLabel,
  Input,
  Textarea,
  FormControl
} from "@chakra-ui/react";

/**
 * This component is used to render the closest city options for the dropdown menu on profile form.
 */
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

/**
 * This component is used to render the gender options for the dropdown menu on profile form.
 */
const Gender = [
  { value: "He/Him/His", label: "He/Him/His" },
  { value: "She/Her/Hers", label: "She/Her/Hers" },
  { value: "They/Them/Theirs", label: "They/Them/Theirs" },
  { value: "Decline to Answer", label: "Decline to Answer" },
];

/**
 * This component is used to render the classes taken options for the dropdown menu on profile form.
 */
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

/**
 * This component is used to render the interest fields options for the dropdown menu on profile form.
 */
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

/**
 * This component is used to render the timezone options for the dropdown menu on profile form.
 */
const Timezones = [
  {
    value: "Etc/GMT+12",
    label: "UTC-12:00 - International Date Line West (IDLW)",
  },
  {
    value: "Pacific/Niue",
    label: "UTC-11:00 - Niue Time (NUT), Samoa Standard Time (SST)",
  },
  {
    value: "Pacific/Marquesas",
    label: "UTC-09:30 - Marquesas Islands Time (MART)",
  },
  { value: "America/Adak", label: "UTC-09:00 - Alaska Standard Time (AKST)" },
  {
    value: "America/Los_Angeles",
    label: "UTC-08:00 - Pacific Standard Time (PST)",
  },
  {
    value: "America/Denver",
    label: "UTC-07:00 - Mountain Standard Time (MST)",
  },
  {
    value: "America/Chicago",
    label: "UTC-06:00 - Central Standard Time (CST)",
  },
  {
    value: "America/New_York",
    label: "UTC-05:00 - Eastern Standard Time (EST)",
  },
  {
    value: "America/Halifax",
    label: "UTC-04:00 - Atlantic Standard Time (AST)",
  },
  {
    value: "America/St_Johns",
    label: "UTC-03:30 - Newfoundland Standard Time (NST)",
  },
  { value: "America/Manaus", label: "UTC-03:00 - Amazon Standard Time (AMT)" },
  {
    value: "America/Noronha",
    label: "UTC-02:00 - Fernando de Noronha Time (FNT)",
  },
  {
    value: "Atlantic/Azores",
    label: "UTC-01:00 - Azores Standard Time (AZOST)",
  },
  { value: "Etc/GMT", label: "UTC+00:00 - Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "UTC+01:00 - Central European Time (CET)" },
  { value: "Europe/Kiev", label: "UTC+02:00 - Eastern European Time (EET)" },
  { value: "Europe/Moscow", label: "UTC+03:00 - Moscow Standard Time (MSK)" },
  { value: "Asia/Tehran", label: "UTC+03:30 - Iran Standard Time (IRST)" },
  { value: "Asia/Dubai", label: "UTC+04:00 - Gulf Standard Time (GST)" },
  { value: "Asia/Kabul", label: "UTC+04:30 - Afghanistan Time (AFT)" },
  { value: "Asia/Kolkata", label: "UTC+05:30 - Indian Standard Time (IST)" },
  { value: "Asia/Kathmandu", label: "UTC+05:45 - Nepal Time (NPT)" },
  { value: "Asia/Dhaka", label: "UTC+06:00 - Bangladesh Time (BST)" },
  { value: "Asia/Yangon", label: "UTC+06:30 - Myanmar Time (MMT)" },
  { value: "Asia/Bangkok", label: "UTC+07:00 - Indochina Time (ICT)" },
  { value: "Asia/Shanghai", label: "UTC+08:00 - China Standard Time (CST)" },
  {
    value: "Australia/Eucla",
    label: "UTC+08:45 - Southeastern Western Australia Standard Time (CWST)",
  },
  { value: "Asia/Tokyo", label: "UTC+09:00 - Japan Standard Time (JST)" },
  {
    value: "Australia/Adelaide",
    label: "UTC+09:30 - Australian Central Standard Time (ACST)",
  },
  {
    value: "Asia/Seoul",
    label: "UTC+09:00 - Japan Standard Time (JST), Korea Standard Time (KST)",
  },
  {
    value: "Australia/Lord_Howe",
    label: "UTC+10:30 - Lord Howe Standard Time (LHST)",
  },
  {
    value: "Pacific/Guadalcanal",
    label: "UTC+11:00 - Solomon Islands Time (SBT)",
  },
  { value: "Pacific/Norfolk", label: "UTC+11:30 - Norfolk Island Time (NFT)" },
  {
    value: "Pacific/Auckland",
    label: "UTC+12:00 - New Zealand Standard Time (NZST)",
  },
  {
    value: "Pacific/Chatham",
    label: "UTC+12:45 - Chatham Standard Time (CHAST)",
  },
  { value: "Pacific/Tongatapu", label: "UTC+13:00 - Tonga Time (TOT)" },
  { value: "Pacific/Kiritimati", label: "UTC+14:00 - Line Island Time (LINT)" },
];

/**
 * This component is used to render the profile form.
 *
 * @param type - A string
 * @param user - A user JSON
 * @param setUser - A function to set a user
 * @param handleKeysArray - A function to handle an array of keys
 * @param firstField - A string
 * @param setUpdatedUser - A function to set an updated user
 * @constructor - Renders the profile form
 * @returns The profile form
 */
// @ts-ignore
const ProfileForm = ({
  user,
  setUser,
  handleKeysArray,
  firstField,
  setUpdatedUser,
}) => {
  useEffect(() => {
    setUpdatedUser(user);
  }, [user, setUpdatedUser]);

  const [initialFiles, setInitialFiles] = useState([user.userUpdatedProfileImage]);

  /**
   * This function is used to update the initial files.
   *
   * @param newFiles - An array of files
   * @returns An array of files
   */
  const updateInitialFiles = (newFiles) => {
    setInitialFiles(newFiles);
  };

  return (
    <Stack spacing="24px">
      <Box>
        <FormControl isRequired>
        <FormLabel htmlFor="firstName">First Name</FormLabel>
        <Input
          ref={firstField}
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          placeholder="Update your first name here..."
          required
        />
        </FormControl>
      </Box>

      <Box>
      <FormControl isRequired>
        <FormLabel htmlFor="lastName">Last Name</FormLabel>
        <Input
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          placeholder="Update your last name here..."
          required
        />
        </FormControl>
      </Box>

      <Box id="closestCity">
        <FormLabel htmlFor="closestCity">Closest Major City/Region</FormLabel>
        <Select
          options={ClosestCity}
          value={ClosestCity.find(
            (city) => city.value === user.closestMainCity
          )}
          onChange={(selectedOption) =>
            setUser({ ...user, closestMainCity: selectedOption.value })
          }
          placeholder="Select your closest major city or region"
        />
      </Box>

      <Box>
        <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
        <Select
          options={Gender}
          value={Gender.find((gender) => gender.value === user.gender)}
          onChange={(selectedOption) =>
            setUser({ ...user, gender: selectedOption.value })
          }
          placeholder="Select your pronouns here"
        />
      </Box>

      <Box>
        <FormLabel htmlFor="bio">Tell us about yourself!</FormLabel>
        <Textarea
          id="bio"
          value={user.bio}
          onChange={(e) => setUser({ ...user, bio: e.target.value })}
          placeholder="Write a brief bio here..."
          required
        />
      </Box>

      <Box>
        <FormLabel htmlFor="classesTaken">Classes Taken</FormLabel>
        <Select
          options={classesTaken}
          closeMenuOnSelect={false}
          value={classesTaken.filter((classTaken) =>
            user.classesTaken.includes(classTaken.value)
          )}
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions.map(
              (option) => option.value
            );
            setUser({ ...user, classesTaken: selectedValues });
          }}
          isMulti
          placeholder="Select all your classes taken here"
        />
      </Box>

      <Box>
        <FormLabel htmlFor="fieldsOfInterest">Fields of Interest</FormLabel>
        <Select
          options={InterestFields}
          value={InterestFields.filter((field) =>
            user.fieldOfInterest.includes(field.value)
          )}
          closeMenuOnSelect={false}
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions.map(
              (option) => option.value
            );
            setUser({ ...user, fieldOfInterest: selectedValues });
          }}
          isMulti
          placeholder="Select your fields of interest here"
        />
      </Box>

      <Box>
        <FormLabel htmlFor="timeZone">Timezone</FormLabel>
        <Select
          options={Timezones}
          value={Timezones.find((timezone) => timezone.value === user.timeZone)}
          onChange={(selectedOption) =>
            setUser({ ...user, timeZone: selectedOption.value })
          }
          placeholder="Select your timezone here"
        />
      </Box>

      <Box>
        <FormLabel htmlFor="dropzone">
          Upload your profile picture below
        </FormLabel>
        <Dropzone
          handleKeysArray={handleKeysArray}
          maxUploads={1}
          initialFiles={initialFiles}
          updateInitialFiles={updateInitialFiles}
        />
      </Box>
    </Stack>
  );
};

export default ProfileForm;

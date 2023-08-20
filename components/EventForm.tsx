import Link from "next/link";
import Dropdown from "./Dropdown";


// @ts-ignore
const EventForm = ({ type, event, setEvent, submitting, handleSubmit }) => {
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post </span>
      </h1>
      <p className="desc text-left max-w-md">{type} your event here.</p>
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Event Name
          </span>
          <input
            value={event.eventName}
            onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
            placeholder="Write your event name here..."
            required
            className="form_input"
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Event Description
          </span>
          <textarea
            value={event.eventDescription}
            onChange={(e) =>
              setEvent({ ...event, eventDescription: e.target.value })
            }
            placeholder="Write your event description here..."
            required
            className="form_textarea"
          />
        </label>

        <div className="checkbox-container flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={event.isVirtual}
              onChange={(e) =>
                setEvent({ ...event, isVirtual: e.target.checked })
              }
            />
            <span className="font-satoshi text-gray-700 ml-2">
              Virtual Event
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={event.isPublic}
              onChange={(e) =>
                setEvent({ ...event, isPublic: e.target.checked })
              }
            />
            <span className="font-satoshi text-gray-700 ml-2">
              Public Event
            </span>
          </label>
        </div>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Location
          </span>
          <input
            type="text"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            placeholder="Enter event location"
            required={!event.isVirtual} // Make the field required only when isVirtual is false
            disabled={event.isVirtual} // Disable the input when isVirtual is true
            className={event.isVirtual ? "form_input disabled" : "form_input"}
          />
        </label>

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
              selected={event.closestCity}
              onSelectedChange={(value) => setEvent({ ...event, closestCity: value })}
          />
        </label>


        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Virtual Meeting Link
          </span>
          <input
            type="text"
            value={event.zoomLink}
            onChange={(e) => setEvent({ ...event, zoomLink: e.target.value })}
            placeholder="Enter zoom link"
            required={event.isVirtual} // Make the field required only when isVirtual is false
            disabled={!event.isVirtual} // Disable the input when isVirtual is true
            className={event.isVirtual ? "form_input" : "form_input disabled"}
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Start Date
          </span>
          <input
            type="date"
            value={event.startDate}
            onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
            required
            className="form_input"
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Start Time
          </span>
          <input
            type="time"
            value={event.startTime}
            onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
            required
            className="form_input"
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Time Zone
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
              selected={event.timeZone}
              onSelectedChange={(value) => setEvent({ ...event, timeZone: value })}
          />
          </label>

        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>

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

export default EventForm;

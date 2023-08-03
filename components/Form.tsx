import Link from "next/link";

const Form = ({ type, event, setEvent, submitting, handleSubmit }) => {
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post </span>
      </h1>
      <p className="desc text-left max-w-md">{type} your event Here.</p>
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
              className="form_checkbox"
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
              className="form_checkbox"
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

export default Form;

import React from "react";

const EventPageFormat = ({ eventDetails, handleEdit, handleDelete }) => {

    // event page format -> details of event in eventDetails as a json

    const renderedKeyValuePairs = Object.entries(eventDetails).map(([key, value]) => (
        <div key={key}>
            <strong>{key}: </strong>
            {typeof value === 'object' ? (
                <pre>{JSON.stringify(value, null, 2)}</pre>
            ) : (
                <span>{value}</span>
            )}
        </div>
    ));

    return (
        <div>
            {renderedKeyValuePairs}
        </div>
    );
};


export default EventPageFormat;

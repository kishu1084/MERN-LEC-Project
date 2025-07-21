const fs = require('fs');
const path = require('path');
const Event = require('../Models/Event');

// Example controller methods

// Create Event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      status,
      pinned,
      tags,
      eventType,
      fee,
      rsvpRequired,
      rsvpLink,
      trainerName,
      them,
    } = req.body;

    const imagePath = req.files['banner'] ? req.files['banner'][0].path : null;

    const eventData = new Event({
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      status,
      pinned,
      tags,
      eventType,
      trainerName,
      fee,
      banner: imagePath,
      rsvpRequired,
      rsvpLink,
      them,
    });

    const savedEvent = await eventData.save();

    res.status(201).json({ success: true, message: 'Event created', data: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
  }
};


// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDateTime: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const  id  = req.params.id;
    const event = await Event.findById(id);
    if(!event) {
        return res.status(404).json({message: "Event not Found", success: false});
    }
    const banner = req.files?.banner ? req.files.banner[0].path : event.banner;
    const updatedData = { ...req.body,banner};

        
    await Event.findByIdAndUpdate(id, { $set: updatedData}, { new: true });
    res.status(200).json({ success: true, message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating event', error: error.message });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Event deleted', data: deletedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
};

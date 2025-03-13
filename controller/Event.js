const Event = require('../Models/Event'); // Import the Event model

// Add a new event
const addEvent = async (req, res) => {
  try {
    const { name, description, time } = req.body;
    const image = req.file ? req.file.path : null; // Assuming you're using multer for file uploads

    const newEvent = new Event({
      name,
      description,
      image,
      time,
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: 'Event added successfully', event: newEvent });
  } catch (error) {
    console.error('Error adding event:', error);
    res
      .status(500)
      .json({ message: 'Failed to add event', error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res
      .status(200)
      .json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    res
      .status(500)
      .json({ message: 'Failed to delete event', error: error.message });
  }
};
const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params; // Get eventId from request params

    const event = await Event.findById(eventId); // Find event by ID

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event); // Send event data
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch events', error: error.message });
  }
};

// Add a question to an event
// const Event = require('../models/Event'); // Import the Event model

// ✅ Add a New Question to an Event
const addQuestion = async (req, res) => {
  try {
    console.log('Received Request Body:', req.body); // ✅ Debugging incoming data

    const { eventId } = req.params;
    const { questions } = req.body; // Expecting an array of questions

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: 'No questions provided or invalid format.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate each question
    for (const q of questions) {
      if (
        !q.question ||
        !q.options ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        typeof q.correctOptionIndex !== 'number' ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex >= q.options.length
      ) {
        console.error('Invalid Question Data:', q); // ✅ Log problematic question
        return res.status(400).json({
          message:
            'Invalid input: question, at least two options, and a valid correctOptionIndex are required',
        });
      }
    }

    // Save questions to event
    event.questions.push(...questions);
    await event.save();

    res.status(201).json({ message: 'Questions added successfully', event });
  } catch (error) {
    console.error('Error adding questions:', error);
    res
      .status(500)
      .json({ message: 'Failed to add questions', error: error.message });
  }
};

// ✅ Get All Questions for a Specific Event
const getQuestionsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event.questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch questions', error: error.message });
  }
};

// Delete a question from an event
const deleteQuestion = async (req, res) => {
  try {
    const { eventId, questionId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find the question and remove it
    event.questions = event.questions.filter(
      (question) => question._id.toString() !== questionId
    );

    await event.save();
    res.status(200).json({ message: 'Question deleted successfully', event });
  } catch (error) {
    console.error('Error deleting question:', error);
    res
      .status(500)
      .json({ message: 'Failed to delete question', error: error.message });
  }
};

// Get all questions for an event
const getQuestions = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event.questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch questions', error: error.message });
  }
};

const submitEventAnswers = async (req, res) => {
  try {
    const { eventId, email, timeTaken, correctAnswers } = req.body;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has already submitted
    const existingUser = event.user.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        message: 'User has already submitted answers for this event.',
      });
    }

    // Create user submission data
    const userSubmission = {
      email,
      time: timeTaken.toString(), // Convert time to string as per schema
      marks: correctAnswers.toString(), // Convert marks to string
    };

    // Push user submission to the event's user array
    event.user.push(userSubmission);

    // Save updated event
    await event.save();

    res.status(200).json({ message: 'Submission successful', userSubmission });
  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addEvent,
  deleteEvent,
  getEvent,
  getEvents,
  addQuestion,
  deleteQuestion,
  getQuestions,
  submitEventAnswers,
};

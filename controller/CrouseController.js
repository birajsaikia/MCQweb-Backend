const Course = require('../Models/Course');

// Add Question to Course
module.exports.addCourseQ = async (req, res) => {
  // Renamed addcouseQ to addCourseQ
  console.log('Add question');
  const { id } = req.params;
  const { question, options, correctOption } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Add the question to the course
    course.questions.push({ question, options, correctOption });
    await course.save();

    res.status(201).json({ message: 'Question added successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding question' });
  }
};

// Get Course with Questions
module.exports.getCourse = async (req, res) => {
  // Renamed getCrouse to getCourse
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course); // Return the course with questions
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
};

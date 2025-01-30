const Course = require('../Models/Course');

// Add Question to Course
// module.exports.addCourseQ = async (req, res) => {
//   // Renamed addcouseQ to addCourseQ
//   console.log('Add question');
//   const { id } = req.params;
//   const { question, options, correctOption } = req.body;

//   try {
//     const course = await Course.findById(id);
//     if (!course) return res.status(404).json({ message: 'Course not found' });

//     // Add the question to the course
//     course.questions.push({ question, options, correctOption });
//     await course.save();

//     res.status(201).json({ message: 'Question added successfully', course });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding question' });
//   }
// };

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

const addQuestion = async (req, res) => {
  const { id } = req.params; // Get course ID from URL parameter
  const { question, options, correctOption } = req.body;

  try {
    // Find the course by ID
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a new question object
    const newQuestion = { question, options, correctOption };

    // Push the new question to the course's questions array
    course.questions.push(newQuestion);
    await course.save();

    return res.status(201).json({
      message: 'Question added successfully!',
      question: newQuestion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding question' });
  }
};

// Add multiple questions to a course (batch insert)
module.exports.addQuestionsBatch = async (req, res) => {
  const { id } = req.params; // Get course ID from URL parameter
  const { questions } = req.body; // Questions array from the request body

  try {
    // Validate that the 'questions' array is provided and not empty
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'No questions provided' });
    }

    // Find the course by ID
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add all the new questions to the course's questions array
    course.questions.push(...questions);
    await course.save();

    return res.status(201).json({
      message: 'Questions added successfully!',
      questions: questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding questions' });
  }
};

// Delete a question from a course
module.exports.deleteQuestion = async (req, res) => {
  const { courseId, questionId } = req.params; // Get course ID and question ID from URL parameters

  try {
    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove the question by its ID from the course's questions array
    course.questions = course.questions.filter(
      (q) => q._id.toString() !== questionId
    );

    await course.save();

    return res.status(200).json({
      message: 'Question deleted successfully!',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting question' });
  }
};

const Course = require('../Models/Course'); // Import the Course model

// ✅ 1️⃣ Add a New Mock Test to a Course
exports.addMockTest = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newMockTest = { name, questions: [] };
    course.mockTests.push(newMockTest);
    await course.save();

    res.status(201).json({
      message: 'Mock Test added successfully!',
      mockTest: newMockTest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ 2️⃣ Delete a Mock Test
exports.deleteMockTest = async (req, res) => {
  try {
    const { courseId, mockTestId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.mockTests = course.mockTests.filter(
      (mock) => mock._id.toString() !== mockTestId
    );
    await course.save();

    res.status(200).json({ message: 'Mock Test deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ 3️⃣ Add a Question to a Mock Test
exports.addMockTestQuestion = async (req, res) => {
  try {
    const { courseId, mockTestId } = req.params;
    const { question, options, correctOption } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const mockTest = course.mockTests.id(mockTestId);
    if (!mockTest)
      return res.status(404).json({ message: 'Mock Test not found' });

    const newQuestion = { question, options, correctOption };
    mockTest.questions.push(newQuestion);
    await course.save();

    res
      .status(201)
      .json({ message: 'Question added successfully!', question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ 4️⃣ Delete a Question from a Mock Test
exports.deleteMockTestQuestion = async (req, res) => {
  try {
    const { courseId, mockTestId, questionId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const mockTest = course.mockTests.id(mockTestId);
    if (!mockTest)
      return res.status(404).json({ message: 'Mock Test not found' });

    mockTest.questions = mockTest.questions.filter(
      (q) => q._id.toString() !== questionId
    );
    await course.save();

    res
      .status(200)
      .json({ message: 'Mock Test Question deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ 5️⃣ Get All Mock Tests for a Course
exports.getMockTests = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json(course.mockTests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ 6️⃣ Get All Questions for a Mock Test
exports.getMockTestQuestions = async (req, res) => {
  try {
    const { courseId, mockTestId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const mockTest = course.mockTests.id(mockTestId);
    if (!mockTest)
      return res.status(404).json({ message: 'Mock Test not found' });

    res.status(200).json(mockTest.questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

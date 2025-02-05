const Course = require('../Models/Course');

// ✅ Add a new course
exports.addCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const course = new Course({ name, description });
    await course.save();
    res.status(201).json({ message: 'Course added successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error });
  }
};

// ✅ Add a subject to a course
exports.addSubject = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    console.log('Received request to add subject');
    console.log('courseId:', courseId);
    console.log('name:', name);

    const course = await Course.findById(courseId);

    if (!course) {
      console.log('Course not found');
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('Course found:', course);

    course.subjects.push({ name, coSubjects: [] });
    await course.save();

    console.log('Subject added successfully');

    res.status(201).json({ message: 'Subject added successfully', course });
  } catch (error) {
    console.error('Error adding subject:', error); // More detailed error log
    res
      .status(500)
      .json({ message: 'Error adding subject', error: error.message });
  }
};

// ✅ Add a co-subject to a subject
exports.addCoSubject = async (req, res) => {
  try {
    const { courseId, subjectId } = req.params;
    const { name } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const subject = course.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    subject.coSubjects.push({ name, questions: [] });
    await course.save();

    res.status(201).json({ message: 'Co-Subject added successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding co-subject', error });
  }
};

// ✅ Add a question to a co-subject
exports.addQuestion = async (req, res) => {
  try {
    console.log('Request received at addQuestion API');
    console.log('Request body:', req.body);
    console.log('Request params:', req.params);

    const { courseId, subjectId, coSubjectId } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.error('Invalid request: Questions array is missing or empty');
      return res.status(400).json({ message: 'Questions array is required!' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    const subject = course.subjects.id(subjectId);
    if (!subject) {
      console.error('Subject not found:', subjectId);
      return res.status(404).json({ message: 'Subject not found' });
    }

    const coSubject = subject.coSubjects.id(coSubjectId);
    if (!coSubject) {
      console.error('Co-Subject not found:', coSubjectId);
      return res.status(404).json({ message: 'Co-Subject not found' });
    }

    questions.forEach((q) => {
      const customId = `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      coSubject.questions.push({
        myid: customId,
        question: q.question,
        options: q.options,
        correctOption: q.correctOption,
      });
    });

    await course.save();
    console.log('Questions added successfully');
    res.status(201).json({ message: 'Questions added successfully!' });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get All Questions for a Specific Co-Subject
exports.getQuestions = async (req, res) => {
  try {
    const { courseId, subjectId, coSubjectId } = req.params;
    console.log('Course ID:', courseId);
    console.log('Subject ID:', subjectId);
    console.log('Co-Subject ID:', coSubjectId);
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const subject = course.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    const coSubject = subject.coSubjects.id(coSubjectId);
   
    
    if (!coSubject)
      return res.status(404).json({ error: 'Co-Subject not found' });

    return res.status(200).json({ quations: coSubject.questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Question from a Co-Subject
exports.deleteQuestion = async (req, res) => {
  try {
    const { courseId, subjectId, cosubjectId, questionId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const subject = course.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    const coSubject = subject.coSubjects.id(cosubjectId);
    if (!coSubject)
      return res.status(404).json({ error: 'Co-Subject not found' });

    // Remove the question
    coSubject.questions = coSubject.questions.filter(
      (q) => q._id.toString() !== questionId
    );

    await course.save(); // Save updated course

    return res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Get all courses with nested structure
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};
exports.getSubject = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Extract courseId from URL params
    const course = await Course.findById(courseId); // Fetch the course by courseId

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.subjects || course.subjects.length === 0) {
      return res
        .status(404)
        .json({ message: 'No subjects found for this course' });
    }

    // Send the course name and subjects in the response
    res.status(200).json({
      courseName: course.name, // Assuming the course name is stored in the 'name' field
      subjects: course.subjects, // Return the subjects array for the course
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res
      .status(500)
      .json({ message: 'Error fetching subjects', error: error.message });
  }
};

exports.getCoSubject = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Extract courseId from URL params
    const subjectId = req.params.subjectId; // Extract subjectId from URL params
    console.log(courseId, subjectId);
    const course = await Course.findById(courseId); // Fetch the course by courseId
    const subject = course.subjects.id(subjectId); // Fetch the subject by subject
    console.log(course.name, subject.name);

    if (!subject) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!subject.coSubjects) {
      return res
        .status(404)
        .json({ message: 'No Cosubject found for this course' });
    }

    res
      .status(200)
      .json({ cosubject: subject.coSubjects, subjectName: subject.name }); // Return the subjects array for the course
    // console.log(subject.coSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res
      .status(500)
      .json({ message: 'Error fetching subjects', error: error.message });
  }
};
exports.getQuation = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Extract courseId from URL params
    const subjectId = req.params.subjectId; // Extract subjectId from URL params
    const coSubjectId = req.params.coSubjectId; // Extract coSubjectId from URL params
    const course = await Course.findById(courseId); // Fetch the course by courseId
    const subject = course.subjects.id(subjectId); // Fetch the subject by subject
    const coSubject1 = subject.coSubjects.id(coSubjectId); // Fetch the coSubject by coSubjectId

    if (!coSubject1) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!coSubject1.questions) {
      return res
        .status(404)
        .json({ message: 'No Cosubject found for this course' });
    }

    res.status(200).json(coSubject1.questions); // Return the subjects array for the course
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res
      .status(500)
      .json({ message: 'Error fetching subjects', error: error.message });
  }
};

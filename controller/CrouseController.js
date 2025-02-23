const Course = require('../Models/Course');
// ✅ Add a new course
exports.addCourse = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file); // Check if file is received

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save the full URL to the image
    const imageUrl = req.file.filename;
    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      image: imageUrl, // Save the full URL in the DB
    });

    await course.save();
    res.status(201).json({ message: 'Course added successfully', course });
  } catch (error) {
    console.error('Error adding course:', error);
    res
      .status(500)
      .json({ message: 'Error adding course', error: error.message });
  }
};
exports.delateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log(courseId);
    // Find the course by ID and delete it
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Return success message
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res
      .status(500)
      .json({ message: 'Error deleting course', error: error.message });
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
exports.addQuestion = async (req, res) => {
  try {
    console.log('Request received at addQuestion API');
    console.log('Request body:', req.body);

    // Extract the questions array from the request body
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.error('Invalid request: Questions array is missing or empty');
      return res.status(400).json({ message: 'Questions array is required!' });
    }

    // Initialize an empty array to store unique course IDs (in case multiple questions belong to different courses)
    const courseIds = [];

    // Loop through each question and extract the courseId
    questions.forEach((question) => {
      const courseId = question.courseId; // Extract courseId from each question
      if (courseId && !courseIds.includes(courseId)) {
        courseIds.push(courseId); // Add the courseId to the array if it's not already present
      }
    });

    // If multiple courseIds are found, handle the scenario or just pick the first one
    if (courseIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'No valid courseId found in the questions' });
    }

    // Assuming you want to use the first courseId for processing
    const courseId = courseIds[0];
    console.log('Using Course ID:', courseId);

    // Find the course based on the courseId
    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    // Process each question and its subjectId and coSubjectId
    for (let q of questions) {
      const {
        subjectId,
        coSubjects, // Now it's an array
        question: questionText,
        options,
        correctOption,
      } = q;

      // Find the subject based on the subjectId
      const subject = course.subjects.id(subjectId);
      if (!subject) {
        console.error('Subject not found:', subjectId);
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Log subject and coSubjects to check their structure
      console.log('Subject:', subject);
      console.log('Co-Subjects:', subject.coSubjects);

      // Loop through coSubjects array and find each coSubjectId
      for (let coSubjectId of coSubjects) {
        const coSubject = subject.coSubjects.id(coSubjectId);
        if (!coSubject) {
          console.error('Co-Subject not found:', coSubjectId);
          return res.status(404).json({ message: 'Co-Subject not found' });
        }

        // Generate a custom ID for the new question
        const customId = `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Add the question to the coSubject's questions array
        coSubject.questions.push({
          myid: customId,
          question: questionText,
          options: options,
          correctOption: correctOption,
        });
      }
    }

    // Save the course after adding the questions
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

    // Modify each course object to include the full image URL
    const updatedCourses = courses.map((course) => ({
      _id: course._id,
      name: course.name,
      description: course.description,
      subjects: course.subjects,
      image: `${req.protocol}://${req.get('host')}/uploads/${course.image}`, // Full URL
    }));

    res.status(200).json(updatedCourses);
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

// const express = require('express');
const cloudinary = require('../Config/cloudinary');
const Course = require('../Models/Course');
// const router = express.Router();

exports.AddNotice = async (req, res) => {
  try {
    const { description, link } = req.body;
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file); // Debugging

    // ✅ Validate required fields
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Create new notice object
    const newNotice = {
      date: new Date(),
      description,
      link: link || '',
    };

    course.notices.push(newNotice);
    await course.save();

    res
      .status(200)
      .json({ message: 'Notice added successfully', notice: newNotice });
  } catch (error) {
    console.error('Error adding notice:', error);
    res.status(500).json({ message: 'Error adding notice', error });
  }
};

exports.GetNotice = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ notices: course.notices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error });
  }
};

// Delete a Notice from a Course
exports.DelateNotice = async (req, res) => {
  try {
    const { courseId, noticeId } = req.params;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Filter out the notice to be deleted
    course.notices = course.notices.filter(
      (notice) => notice._id.toString() !== noticeId
    );

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Notice deleted successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice', error });
  }
};

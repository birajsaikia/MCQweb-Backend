const express = require('express');
const router = express.Router();
const Course = require('../Models/Course');
const Event = require('../Models/Event');
const Milestone = require('../Models/milestone');

// ✅ Fetch Data
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let data;

    if (type === 'course') data = await Course.find();
    if (type === 'event') data = await Event.find();
    if (type === 'milestone') data = await Milestone.find();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// ✅ Add New Item
router.post('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { name } = req.body;
    let newItem;

    if (type === 'course') newItem = new Course({ name });
    if (type === 'event') newItem = new Event({ name });
    if (type === 'milestone') newItem = new Milestone({ name });

    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item' });
  }
});

// ✅ Delete Item
router.delete('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === 'course') await Course.findByIdAndDelete(id);
    if (type === 'event') await Event.findByIdAndDelete(id);
    if (type === 'milestone') await Milestone.findByIdAndDelete(id);

    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});
// router.post('/addcouseq/:id/add-question', async (req, res) => {
//   console.log('Add question');
//   const { id } = req.params;
//   const { question, options, correctOption } = req.body;

//   try {
//     const course = await Course.findById(id);
//     if (!course) return res.status(404).json({ message: 'Course not found' });

//     course.questions.push({ question, options, correctOption });
//     await course.save();

//     res.status(201).json({ message: 'Question added successfully', course });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding question' });
//   }
// });

module.exports = router;

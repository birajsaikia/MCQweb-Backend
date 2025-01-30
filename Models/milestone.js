const mongoose = require('mongoose');
const MilestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
module.exports = mongoose.model('Milestone', MilestoneSchema);

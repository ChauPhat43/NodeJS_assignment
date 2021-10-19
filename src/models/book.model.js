const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const bookSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
  },
  author: {
      type: String,
      required: true,
  }
});

bookSchema.plugin(toJSON);
bookSchema.plugin(paginate);

bookSchema.statics.isNameTaken = async function (title, excludeUserId) {
  const book = await this.findOne({title, _id: { $ne: excludeUserId } });
  return !!book;
};


module.exports = mongoose.model('Book', bookSchema);

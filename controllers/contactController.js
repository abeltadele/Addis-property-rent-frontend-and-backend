// Contact controller for handling contact requests
const Contact = require('../models/Contact');

/**
 * @desc    Create new contact request
 * @route   POST /api/contact
 * @access  Private
 */
exports.createContact = async (req, res, next) => {
  try {
    const { property, agent, message } = req.body;

    // Validate input
    if (!property || !agent || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property, agent, and message'
      });
    }

    // Create contact
    const contact = await Contact.create({
      user: req.user.id,
      agent,
      property,
      message
    });

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all contact requests for a user
 * @route   GET /api/contact
 * @access  Private
 */
exports.getContacts = async (req, res, next) => {
  try {
    // If user is admin, get all contacts
    // If user is agent, get contacts where they are the agent
    // If user is regular user, get contacts where they are the user
    let query = {};

    if (req.user.role === 'agent') {
      query.agent = req.user.id;
    } else if (req.user.role === 'user') {
      query.user = req.user.id;
    }

    const contacts = await Contact.find(query)
      .populate('user', 'name email')
      .populate('agent', 'name email')
      .populate('property', 'title location.city')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    next(err);
  }
};
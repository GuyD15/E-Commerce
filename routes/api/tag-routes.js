const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// Get all tags with associated products
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });

    if (!tagData) {
      return res.status(404).json({ message: 'No tags found' });
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single tag by its ID with associated products
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tagName,
    });

    res.status(201).json(newTag);
    console.log('Tag created!');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a tag's name by its ID
router.put('/:id', async (req, res) => {
  try {
    await Tag.update(
      {
        tag_name: req.body.tagName,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tagData);
    console.log('Tag updated!');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a tag by its ID
router.delete('/:id', async (req, res) => {
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json({ message: 'Tag deleted' });
    console.log('Tag deleted!');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

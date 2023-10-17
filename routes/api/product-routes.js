const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// find all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productData) {
      res.status(200).json({message: 'Unable to locate product'});
      return;
    }

    res.json(productData);

  } catch (err) {
    res.status(500).json(err);
  }
});

// find a single product by its ID
router.get('/:id', async (req, res) => {
  try {
    const productById = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }]
    });
    if (!productById) {
      res.status(200).json({message: 'Unable to locate product'});
      return;
    }

    res.status(200).json(productById);

  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {

  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
    
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

   
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its ID
router.delete('/:id', async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!deleteProduct) {
      res.status(200).json({message: 'Unable to locate product'});
      return;
    }

    res.status(200).json(deleteProduct);
    console.log("Product deleted!");
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

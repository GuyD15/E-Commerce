const router = require('express').Router();
const { Category, Product } = require('../../models');
// Finding all categories
router.get('/', async (req, res) => {
    try {
        const categoryData = await Category.findAll({
            include: [{model: Product}]
        });

        if (!categoryData) {
            res.status(200).json({message: 'Unable to locate categories'});
        };

        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    };
});

// find a category by it's id
router.get('/:id', async (req, res) => {
    try{
        const categoryDataId = await Category.findByPk(req.params.id, {
            include: [{ model: Product }]
        });

        if (!categoryDataId) {
            res.status(200).json({message: 'Unable to locate categories'});
        };

        res.status(200).json(categoryDataId);
    } catch (err) {
        res.status(500).json(err);
    };
});

// create a new cateogy
router.post('/', async (req, res) => {
    try {
        const newCategory = await Category.create({
            category_name: req.bnody.categoryName
        })

        res.status(200).json(newCategory);
        console.log('New category has been added.')
    } catch (err) {
        res.status(500).json(err);
    };
});

// update a category by the id 
router.put('/:id', async (req, res) => {
    try {
        const updateCategory = await Category.update({
            category_name: req.body.categoryName
        },
        {
            where: {
                id: req.params.id
            }
        });

        const categoryById = await Category.findByPk(req.params.id, {
            include: [{ model: Product }]
        });

        if (!categoryById) {
            res.status(200).json({message: 'Can not update, there is no valid ID.'});
            return;
        };

        res.status(200).json(updateCategory);
        console.log("Category has been updated!");

    }   catch (err) {
        res.status(500).json(err);
    };
});

// delete a category by the id
router.delete('/:id', async (req, res) => {
    try {
        const deleteCategory = await Category.destroy({
            where: {
                id: req.params.id,
            }
        });

        if(!deleteCategory) {
            res.status(200).json({message: 'No category found with this ID'});
            return;
        };
        
        res.status(200).json(deleteCategory);
        console.log('Category has been deleted.');
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;
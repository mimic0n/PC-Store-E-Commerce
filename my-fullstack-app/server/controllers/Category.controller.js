import Category from '../models/Category.model.js';
import { Op } from 'sequelize';

//function để tạo slug từ tên
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// ========== CREATE CATEGORY ==========
export async function createCategory(request, response) {
    try {
        const { name, description, image, parentId, isActive } = request.body;

        // Validate required fields
        if (!name) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Tên danh mục là bắt buộc'
            });
        }

        // Check if category name already exists
        const existingCategory = await Category.findOne({ 
            where: { name: name } 
        });
        
        if (existingCategory) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Tên danh mục đã tồn tại'
            });
        }

        // Validate parentId if provided
        let level = 1;
        if (parentId) {
            const parentCategory = await Category.findByPk(parentId);
            if (!parentCategory) {
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Danh mục cha không tồn tại'
                });
            }
            level = parentCategory.level + 1;
        }

        // Generate slug
        const slug = generateSlug(name);

        // Check if slug already exists
        let finalSlug = slug;
        let slugExists = await Category.findOne({ where: { slug: finalSlug } });
        let counter = 1;
        while (slugExists) {
            finalSlug = `${slug}-${counter}`;
            slugExists = await Category.findOne({ where: { slug: finalSlug } });
            counter++;
        }

        // Create category
        const newCategory = await Category.create({
            name,
            slug: finalSlug,
            description: description || null,
            image: image || null,
            parentId: parentId || null,
            level,
            isActive: isActive !== undefined ? isActive : true
        });

        return response.status(201).json({
            success: true,
            error: false,
            message: 'Tạo danh mục thành công',
            data: newCategory
        });

    } catch (error) {
        console.error('Create category error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi tạo danh mục'
        });
    }
}

// ========== GET ALL CATEGORIES ==========
export async function getAllCategories(request, response) {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            isActive,
            parentId,
            includeChildren = false 
        } = request.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build where clause
        const whereClause = {};
        
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        if (parentId !== undefined) {
            whereClause.parentId = parentId === 'null' ? null : parseInt(parentId);
        }

        // Build include options
        const includeOptions = includeChildren === 'true' ? [
            {
                model: Category,
                as: 'children',
                required: false,
                separate: true,
                include: [{
                    model: Category,
                    as: 'children',
                    required: false,
                    separate: true,
                    order: [['name', 'ASC']],
                    include: [{  
                        model: Category,
                        as: 'children',
                        required: false,
                        separate: true,
                        order: [['name', 'ASC']]
                    }]
                }]
            },
            {
                model: Category,
                as: 'parent',
                required: false
            }
        ] : [
            {
                model: Category,
                as: 'parent',
                required: false,
                attributes: ['id', 'name', 'slug']
            }
        ];

        const count = await Category.count({ where: whereClause });


        const categories = await Category.findAll({
            where: whereClause,
            include: includeOptions,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy danh sách danh mục thành công',
            data: categories,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / parseInt(limit)),
                totalItems: count,
                itemsPerPage: parseInt(limit)
            }
        });


    } catch (error) {
        console.error('Get all categories error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy danh sách danh mục'
        });
    }
}

// ========== GET CATEGORY BY ID ==========
export async function getCategoryById(request, response) {
    try {
        const { id } = request.params;

        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'children',
                    required: false
                },
                {
                    model: Category,
                    as: 'parent',
                    required: false
                }
            ]
        });

        if (!category) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục'
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy thông tin danh mục thành công',
            data: category
        });

    } catch (error) {
        console.error('Get category by id error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy thông tin danh mục'
        });
    }
}

// ========== GET CATEGORY BY SLUG ==========
export async function getCategoryBySlug(request, response) {
    try {
        const { slug } = request.params;

        const category = await Category.findOne({
            where: { slug },
            include: [
                {
                    model: Category,
                    as: 'children',
                    required: false
                },
                {
                    model: Category,
                    as: 'parent',
                    required: false
                }
            ]
        });

        if (!category) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục'
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy thông tin danh mục thành công',
            data: category
        });

    } catch (error) {
        console.error('Get category by slug error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy thông tin danh mục'
        });
    }
}

// ========== UPDATE CATEGORY ==========
export async function updateCategory(request, response) {
    try {
        const { id } = request.params;
        const { name, description, image, parentId, isActive } = request.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Check if new name already exists (exclude current category)
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({
                where: { 
                    name: name,
                    id: { [Op.ne]: id }
                }
            });
            
            if (existingCategory) {
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Tên danh mục đã tồn tại'
                });
            }
        }

        // Validate parentId
        if (parentId !== undefined && parentId !== null) {
            // Cannot set itself as parent
            if (parseInt(parentId) === parseInt(id)) {
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Không thể đặt chính nó làm danh mục cha'
                });
            }

            const parentCategory = await Category.findByPk(parentId);
            if (!parentCategory) {
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Danh mục cha không tồn tại'
                });
            }

            // Check if parentId is one of its children (avoid circular reference)
            const children = await Category.findAll({
                where: { parentId: id }
            });
            const childIds = children.map(child => child.id);
            if (childIds.includes(parseInt(parentId))) {
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Không thể đặt danh mục con làm danh mục cha'
                });
            }
        }

        // Update slug if name changed
        let newSlug = category.slug;
        if (name && name !== category.name) {
            newSlug = generateSlug(name);
            let slugExists = await Category.findOne({ 
                where: { 
                    slug: newSlug,
                    id: { [Op.ne]: id }
                } 
            });
            let counter = 1;
            while (slugExists) {
                newSlug = `${generateSlug(name)}-${counter}`;
                slugExists = await Category.findOne({ 
                    where: { 
                        slug: newSlug,
                        id: { [Op.ne]: id }
                    } 
                });
                counter++;
            }
        }

        // Update category
        await category.update({
            name: name || category.name,
            slug: newSlug,
            description: description !== undefined ? description : category.description,
            image: image !== undefined ? image : category.image,
            parentId: parentId !== undefined ? parentId : category.parentId,
            isActive: isActive !== undefined ? isActive : category.isActive
        });

        // Fetch updated category with relations
        const updatedCategory = await Category.findByPk(id, {
            include: [
                { model: Category, as: 'children', required: false },
                { model: Category, as: 'parent', required: false }
            ]
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Cập nhật danh mục thành công',
            data: updatedCategory
        });

    } catch (error) {
        console.error('Update category error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi cập nhật danh mục'
        });
    }
}

// ========== DELETE CATEGORY ==========
export async function deleteCategory(request, response) {
    try {
        const { id } = request.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Check if category has children
        const childrenCount = await Category.count({
            where: { parentId: id }
        });

        if (childrenCount > 0) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Không thể xóa danh mục có danh mục con. Vui lòng xóa các danh mục con trước.'
            });
        }

        // const productsCount = await Product.count({
        //     where: { categoryId: id }
        // });
        // if (productsCount > 0) {
        //     return response.status(400).json({
        //         success: false,
        //         error: true,
        //         message: 'Không thể xóa danh mục đang có sản phẩm'
        //     });
        // }

        await category.destroy();

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa danh mục thành công'
        });

    } catch (error) {
        console.error('Delete category error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi xóa danh mục'
        });
    }
}

// ========== GET CATEGORY TREE (Hierarchical) ==========
export async function getCategoryTree(request, response) {
    try {
        // Get all root categories (no parent)
        const categories = await Category.findAll({
            where: { 
                parentId: null,
                isActive: true 
            },
            include: [{
                model: Category,
                as: 'children',
                required: false,
                where: { isActive: true },
                include: [{
                    model: Category,
                    as: 'children',
                    required: false,
                    where: { isActive: true }
                }]
            }],
            order: [['name', 'ASC']]
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy cây danh mục thành công',
            data: categories
        });

    } catch (error) {
        console.error('Get category tree error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy cây danh mục'
        });
    }
}
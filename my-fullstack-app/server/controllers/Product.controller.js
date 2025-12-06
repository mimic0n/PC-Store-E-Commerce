import { Product, Category } from '../models/index.js';
import { Op } from 'sequelize';
import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';

// Function để tạo slug từ tên
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

// ========== UPLOAD IMAGES ==========
export async function uploadImages(request, response) {
    try {
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Không có file nào được upload'
            });
        }

        const uploadPromises = request.files.map(file => {
            return cloudinary.uploader.upload(file.path, {
                folder: 'products',
                resource_type: 'image'
            });
        });

        const results = await Promise.all(uploadPromises);

        // Xóa file tạm sau khi upload
        request.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        const imageUrls = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id
        }));

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Upload ảnh thành công',
            data: imageUrls
        });

    } catch (error) {
        console.error('Upload images error:', error);
        // Xóa file tạm nếu có lỗi
        if (request.files) {
            request.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi upload ảnh'
        });
    }
}

// ========== CREATE PRODUCT ==========
export async function createProduct(request, response) {
    try {
        const {
            name,
            description,
            price,
            salePrice,
            quantity,
            images,
            thumbnail,
            brand,
            specifications,
            categoryId,
            isFeatured,
            isActive
        } = request.body;

        // Validate required fields
        if (!name || !price || !categoryId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Tên, giá và danh mục là bắt buộc'
            });
        }

        // Check if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Danh mục không tồn tại'
            });
        }

        // Generate unique slug
        const slug = generateSlug(name);
        let finalSlug = slug;
        let slugExists = await Product.findOne({ where: { slug: finalSlug } });
        let counter = 1;
        while (slugExists) {
            finalSlug = `${slug}-${counter}`;
            slugExists = await Product.findOne({ where: { slug: finalSlug } });
            counter++;
        }

        // Create product
        const newProduct = await Product.create({
            name,
            slug: finalSlug,
            description: description || null,
            price,
            salePrice: salePrice || null,
            quantity: quantity || 0,
            images: images || null,
            thumbnail: thumbnail || null,
            brand: brand || null,
            specifications: specifications || null,
            categoryId,
            categoryLevel: category.level,
            isFeatured: isFeatured || false,
            isActive: isActive !== undefined ? isActive : true
        });

        return response.status(201).json({
            success: true,
            error: false,
            message: 'Tạo sản phẩm thành công',
            data: newProduct
        });

    } catch (error) {
        console.error('Create product error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi tạo sản phẩm'
        });
    }
}

// ========== GET ALL PRODUCTS ==========
export async function getAllProducts(request, response) {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            order = 'DESC',
            isActive
        } = request.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { brand: { [Op.like]: `%${search}%` } }
            ];
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy danh sách sản phẩm thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get all products error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy danh sách sản phẩm'
        });
    }
}

// ========== GET PRODUCT BY ID ==========
export async function getProduct(request, response) {
    try {
        const { id } = request.params;

        const product = await Product.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }]
        });

        if (!product) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm thành công',
            data: product
        });

    } catch (error) {
        console.error('Get product error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm'
        });
    }
}

// ========== GET PRODUCTS BY CATEGORY ID ==========
export async function getAllProductsByCatId(request, response) {
    try {
        const { id } = request.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = request.query;
        const offset = (page - 1) * limit;

        const { count, rows: products } = await Product.findAndCountAll({
            where: { categoryId: id, isActive: true },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo danh mục thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by category error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo danh mục'
        });
    }
}

// ========== GET PRODUCTS BY CATEGORY NAME ==========
export async function getAllProductsByCatName(request, response) {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = request.query;
        const categoryName = request.query.name || request.params.name;
        const offset = (page - 1) * limit;

        const category = await Category.findOne({
            where: { name: { [Op.like]: `%${categoryName}%` } }
        });

        if (!category) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục'
            });
        }

        const getAllChildCategoryIds = async (parentId) => {
            const children = await Category.findAll({
                where: { parentId: parentId },
                attributes: ['id']
            });
            
            let ids = [];
            for (const child of children) {
                ids.push(child.id);
                const grandChildIds = await getAllChildCategoryIds(child.id);
                ids = ids.concat(grandChildIds);
            }
            return ids;
        };

        const childIds = await getAllChildCategoryIds(category.id);
        const allCategoryIds = [category.id, ...childIds];


        const { count, rows: products } = await Product.findAndCountAll({
            where: { categoryId: allCategoryIds , isActive: true },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo tên danh mục thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by category name error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo tên danh mục'
        });
    }
}

// ========== GET PRODUCTS BY SUB CATEGORY ID ==========
export async function getAllProductsBySubCatId(request, response) {
    try {
        const { id } = request.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = request.query;
        const offset = (page - 1) * limit;

        // Lấy tất cả category con của subcategory này
        const subCategories = await Category.findAll({
            where: { parentId: id }
        });

        const categoryIds = [parseInt(id), ...subCategories.map(cat => cat.id)];

        const { count, rows: products } = await Product.findAndCountAll({
            where: { 
                categoryId: { [Op.in]: categoryIds },
                isActive: true 
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo danh mục con thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by sub category error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo danh mục con'
        });
    }
}

// ========== GET PRODUCTS BY SUB CATEGORY NAME ==========
export async function getAllProductsBySubCatName(request, response) {
    try {
        const subCatName = request.query.name || request.params.name;
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = request.query;
        const offset = (page - 1) * limit;

        const subCategory = await Category.findOne({
            where: { name: { [Op.like]: `%${subCatName}%` } }
        });

        if (!subCategory) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục con'
            });
        }

        const subCategories = await Category.findAll({
            where: { parentId: subCategory.id }
        });

        const categoryIds = [subCategory.id, ...subCategories.map(cat => cat.id)];

        const { count, rows: products } = await Product.findAndCountAll({
            where: { 
                categoryId: { [Op.in]: categoryIds },
                isActive: true 
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo tên danh mục con thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by sub category name error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo tên danh mục con'
        });
    }
}

// ========== GET PRODUCTS BY THIRD LEVEL CATEGORY ID ==========
export async function getAllProductsByThirdLevelCatId(request, response) {
    try {
        const { id } = request.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = request.query;
        const offset = (page - 1) * limit;

        const category = await Category.findByPk(id);
        if (!category) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục'
            });
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: { categoryId: id, isActive: true },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo danh mục cấp 3 thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by third level category error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo danh mục cấp 3'
        });
    }
}

// ========== GET PRODUCTS BY THIRD LEVEL CATEGORY NAME ==========
export async function getAllProductsByThirdLevelCatName(request, response) {
    try {
        const thirdCatName = request.query.name || request.params.name;
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = request.query;
        const offset = (page - 1) * limit;

        const thirdCategory = await Category.findOne({
            where: { name: { [Op.like]: `%${thirdCatName}%` } }
        });

        if (!thirdCategory) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy danh mục cấp 3'
            });
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: { categoryId: thirdCategory.id, isActive: true },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo tên danh mục cấp 3 thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by third level category name error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo tên danh mục cấp 3'
        });
    }
}

// ========== GET PRODUCTS BY PRICE ==========
export async function getAllProductsByPrice(request, response) {
    try {
        const { minPrice = 0, maxPrice, page = 1, limit = 10, sortBy = 'price', order = 'ASC' } = request.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            isActive: true,
            price: { [Op.gte]: parseFloat(minPrice) }
        };

        if (maxPrice) {
            whereClause.price[Op.lte] = parseFloat(maxPrice);
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo giá thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by price error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo giá'
        });
    }
}

// ========== GET PRODUCTS BY RATING ==========
export async function getAllProductsByRating(request, response) {
    try {
        const { minRating = 0, page = 1, limit = 10, sortBy = 'rating', order = 'DESC' } = request.query;
        const offset = (page - 1) * limit;

        const { count, rows: products } = await Product.findAndCountAll({
            where: {
                isActive: true,
                rating: { [Op.gte]: parseFloat(minRating) }
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm theo đánh giá thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get products by rating error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm theo đánh giá'
        });
    }
}

// ========== GET PRODUCTS COUNT ==========
export async function getProductsCount(request, response) {
    try {
        const { categoryId, isActive, includeChildren = 'false' } = request.query;
        const whereClause = {};

        if (categoryId) {
            if (includeChildren === 'true') {
                const getAllChildCategoryIds = async (parentId) => {
                    const children = await Category.findAll({
                        where: { parentId: parentId },
                        attributes: ['id']
                    });
                    
                    let ids = [];
                    for (const child of children) {
                        ids.push(child.id);
                        const grandChildIds = await getAllChildCategoryIds(child.id);
                        ids = ids.concat(grandChildIds);
                    }
                    return ids;
                };

                const childIds = await getAllChildCategoryIds(parseInt(categoryId));
                const allCategoryIds = [parseInt(categoryId), ...childIds];
                whereClause.categoryId = { [Op.in]: allCategoryIds };
            } else {
                whereClause.categoryId = categoryId;
            }
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const count = await Product.count({ where: whereClause });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy số lượng sản phẩm thành công',
            data: { count }
        });

    } catch (error) {
        console.error('Get products count error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy số lượng sản phẩm'
        });
    }
}

// ========== GET ALL FEATURED PRODUCTS ==========
export async function getAllFeaturedProducts(request, response) {
    try {
        const { page = 1, limit = 10 } = request.query;
        const offset = (page - 1) * limit;

        const { count, rows: products } = await Product.findAndCountAll({
            where: { isFeatured: true, isActive: true },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Lấy sản phẩm nổi bật thành công',
            data: products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Get featured products error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi lấy sản phẩm nổi bật'
        });
    }
}

// ========== UPDATE PRODUCT ==========
export async function updateProduct(request, response) {
    try {
        const { id } = request.params;
        const {
            name,
            description,
            price,
            salePrice,
            quantity,
            images,
            thumbnail,
            brand,
            specifications,
            categoryId,
            isFeatured,
            isActive
        } = request.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Check if category exists
        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return response.status(400).json({
                    success: false,
                    error: true,
                    message: 'Danh mục không tồn tại'
                });
            }
        }

        // Update slug if name changed
        let finalSlug = product.slug;
        if (name && name !== product.name) {
            const slug = generateSlug(name);
            finalSlug = slug;
            let slugExists = await Product.findOne({ 
                where: { 
                    slug: finalSlug,
                    id: { [Op.ne]: id }
                } 
            });
            let counter = 1;
            while (slugExists) {
                finalSlug = `${slug}-${counter}`;
                slugExists = await Product.findOne({ 
                    where: { 
                        slug: finalSlug,
                        id: { [Op.ne]: id }
                    } 
                });
                counter++;
            }
        }

        await product.update({
            name: name || product.name,
            slug: finalSlug,
            description: description !== undefined ? description : product.description,
            price: price || product.price,
            salePrice: salePrice !== undefined ? salePrice : product.salePrice,
            quantity: quantity !== undefined ? quantity : product.quantity,
            images: images !== undefined ? images : product.images,
            thumbnail: thumbnail !== undefined ? thumbnail : product.thumbnail,
            brand: brand !== undefined ? brand : product.brand,
            specifications: specifications !== undefined ? specifications : product.specifications,
            categoryId: categoryId || product.categoryId,
            isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured,
            isActive: isActive !== undefined ? isActive : product.isActive
        });

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Cập nhật sản phẩm thành công',
            data: product
        });

    } catch (error) {
        console.error('Update product error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi cập nhật sản phẩm'
        });
    }
}

// ========== DELETE PRODUCT ==========
export async function deleteProduct(request, response) {
    try {
        const { id } = request.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        let images = product.images;

        // Kiểm tra và parse nếu images là string JSON
        if (typeof images === 'string') {
            try {
                images = JSON.parse(images);
            } catch (e) {
                images = null;
            }
        }

        if (Array.isArray(images) && images.length > 0) {
            const deletePromises = images.map(img => {
                if (img && img.publicId) {
                    return cloudinary.uploader.destroy(img.publicId);
                }
                return Promise.resolve();
            });
            await Promise.all(deletePromises);
        }

        await product.destroy();

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa sản phẩm thành công'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi xóa sản phẩm'
        });
    }
}

// ========== REMOVE IMAGE FROM CLOUDINARY ==========
export async function removeImageFromCloudinary(request, response) {
    try {
        const { publicId } = request.body;

        if (!publicId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'PublicId là bắt buộc'
            });
        }

        const result = await cloudinary.uploader.destroy(publicId);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa ảnh thành công',
            data: result
        });

    } catch (error) {
        console.error('Remove image error:', error);
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || 'Lỗi khi xóa ảnh'
        });
    }
}
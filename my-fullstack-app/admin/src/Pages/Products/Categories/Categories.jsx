import React, { useState, useEffect } from 'react'
import './Categories.css'
import {
  IoAddOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoGridOutline,
  IoListOutline,
  IoRefreshOutline,
  IoCloseOutline,
  IoAddCircleOutline
} from 'react-icons/io5'
import { FaFolder, FaFolderOpen } from "react-icons/fa6";
import {
  getAllCategories,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../../api/categoryService'

export const Categories = () => {
  const [categories, setCategories] = useState([])
  const [allCategories, setAllCategories] = useState([]) // Lưu tất cả categories cho modal
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState([])
  const [expandedLevel2, setExpandedLevel2] = useState([])
  const [viewMode, setViewMode] = useState('list')
  const [showModal, setShowModal] = useState(false)
  const [showSubModal, setShowSubModal] = useState(false) // Modal cho SubCategory
  const [editingCategory, setEditingCategory] = useState(null)
  const [parentForSub, setParentForSub] = useState(null) // Parent khi thêm sub
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      // Luôn lấy root categories với children
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        includeChildren: 'true',
        parentId: 'null' // Chỉ lấy root categories
      }

      if (searchTerm) {
        params.search = searchTerm
        delete params.parentId // Khi search, tìm tất cả
      }
      
      if (filterStatus !== 'all') {
        params.isActive = filterStatus === 'active'
      }

      const response = await getAllCategories(params)
      console.log('API Response:', response) 
      console.log('Categories data:', response?.data) 
      console.log('First category children:', response?.data?.[0]?.children)
      
      if (response && response.success) {
        setCategories(response.data || [])
        setTotalPages(response.pagination?.totalPages || 1)
        setTotalItems(response.pagination?.totalItems || 0)
      }

      // Lấy tất cả categories cho modal (để chọn parent)
      const allResponse = await getAllCategories({ 
        limit: 100, 
        includeChildren: 'true',
        parentId: 'null'
      })
      if (allResponse && allResponse.success) {
        setAllCategories(allResponse.data || [])
      }
    }
    catch (err) {
      console.error('Error fetching categories:', err)
      if (err.code === 'ERR_NETWORK') {
        setError('Không thể kết nối tới server.')
      }
      else {
        setError(err.response?.data?.message || err.message || 'Lỗi khi tải danh mục')
      }
    }
    finally {
      setLoading(false)
    }
  }

  // Load categories on mount and when filters change
  useEffect(() => {
    fetchCategories()
  }, [currentPage, filterStatus])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchCategories()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Toggle expand/collapse category
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Toggle expand/collapse level 2
  const toggleLevel2 = (categoryId) => {
    setExpandedLevel2(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  // ========== CATEGORY HANDLERS ==========
  
  // Handle save ROOT category (create/update)
  const handleSaveCategory = async (categoryData) => {
    setLoading(true)
    setError(null)
    try {
      if (editingCategory) {
        const response = await updateCategory(editingCategory.id, categoryData)
        if (response.success) {
          showSuccess('Cập nhật danh mục thành công!')
          fetchCategories()
        }
      } else {
        // Tạo root category (không có parentId)
        const response = await createCategory({ ...categoryData, parentId: null })
        if (response.success) {
          showSuccess('Tạo danh mục thành công!')
          fetchCategories()
        }
      }
      setShowModal(false)
      setEditingCategory(null)
    }
    catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu danh mục')
      console.error('Error saving category:', err)
    }
    finally {
      setLoading(false)
    }
  }

  // Handle delete category
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}"?`)) {
      setLoading(true)
      setError(null)
      try {
        const response = await deleteCategory(categoryId)
        if (response.success) {
          showSuccess('Xóa danh mục thành công!')
          fetchCategories()
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi xóa danh mục')
        console.error('Error deleting category:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  // ========== SUBCATEGORY HANDLERS ==========

  // Open modal to ADD subcategory
  const handleAddSubCategory = (parentCategory) => {
    setParentForSub(parentCategory)
    setEditingCategory(null)
    setShowSubModal(true)
  }

  // Open modal to EDIT subcategory
  const handleEditSubCategory = (subCategory, parentCategory) => {
    setParentForSub(parentCategory)
    setEditingCategory(subCategory)
    setShowSubModal(true)
  }

  // Handle save SUB category (create/update)
  const handleSaveSubCategory = async (categoryData) => {
    setLoading(true)
    setError(null)
    try {
      if (editingCategory) {
        // Update subcategory
        const response = await updateCategory(editingCategory.id, categoryData)
        if (response.success) {
          showSuccess('Cập nhật danh mục con thành công!')
          fetchCategories()
        }
      } else {
        // Create new subcategory với parentId
        const response = await createCategory({
          ...categoryData,
          parentId: parentForSub.id
        })
        if (response.success) {
          showSuccess('Tạo danh mục con thành công!')
          fetchCategories()
          // Auto expand parent
          if (!expandedCategories.includes(parentForSub.id)) {
            setExpandedCategories(prev => [...prev, parentForSub.id])
          }
        }
      }
      setShowSubModal(false)
      setEditingCategory(null)
      setParentForSub(null)
    }
    catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu danh mục con')
      console.error('Error saving subcategory:', err)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='categories'>
      {/* Success Message */}
      {successMessage && (
        <div className='categories__alert categories__alert--success'>
          {successMessage}
          <button onClick={() => setSuccessMessage(null)}><IoCloseOutline /></button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className='categories__alert categories__alert--error'>
          {error}
          <button onClick={() => setError(null)}><IoCloseOutline /></button>
        </div>
      )}

      {/* Header */}
      <div className='categories__header'>
        <div className='categories__header-left'>
          <h1 className='categories__title'>Categories</h1>
          <p className='categories__subtitle'>
            Category Manage : ({totalItems} Category)
          </p>
        </div>
        <div className='categories__header-actions'>
          <button 
            className='categories__btn categories__btn--outline'
            onClick={fetchCategories}
            disabled={loading}
          >
            <IoRefreshOutline className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button 
            className='categories__btn categories__btn--primary'
            onClick={() => {
              setEditingCategory(null)
              setShowModal(true)
            }}
          >
            <IoAddOutline />
            Add Category
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className='categories__toolbar'>
        <div className='categories__search'>
          <IoSearchOutline />
          <input
            type='text'
            placeholder='Search For Category...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='categories__toolbar-actions'>
          <select 
            className='categories__filter'
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value='all'>Tất cả trạng thái</option>
            <option value='active'>Đang hoạt động</option>
            <option value='inactive'>Không hoạt động</option>
          </select>

          <div className='categories__view-toggle'>
            <button
              className={`categories__view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <IoListOutline />
            </button>
            <button
              className={`categories__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <IoGridOutline />
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className='categories__loading'>
          <div className='categories__spinner'></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Categories List View */}
      {!loading && viewMode === 'list' ? (
        <div className='categories__list'>
          {categories.length === 0 ? (
            <div className='categories__empty'>
              <p>There Is No Category</p>
            </div>
          ) : (
            categories.map(category => (
              <div key={category.id} className='categories__item'>
                {/* Category Header */}
                <div className='categories__item-header'>
                  <div className='categories__item-left'>
                    <button
                      className='categories__expand-btn'
                      onClick={() => toggleCategory(category.id)}
                      disabled={!category.children?.length}
                    >
                      {category.children?.length > 0 ? (
                        expandedCategories.includes(category.id) 
                          ? <IoChevronUpOutline /> 
                          : <IoChevronDownOutline />
                      ) : <span style={{width: '16px'}}></span>}
                    </button>
                    <span className='categories__icon'>
                      {expandedCategories.includes(category.id) ? <FaFolderOpen /> : <FaFolder />}
                    </span>
                    <div className='categories__info'>
                      <h3 className='categories__name'>{category.name}</h3>
                      <p className='categories__slug'>/{category.slug}</p>
                    </div>
                  </div>
                  
                  <div className='categories__item-right'>
                    <span className='categories__level'>Level {category.level}</span>
                    <span className='categories__children-count'>
                      {category.children?.length || 0} sub
                    </span>
                    <span className={`categories__status categories__status--${category.isActive ? 'active' : 'inactive'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className='categories__actions'>
                      {/* Add SubCategory Button */}
                      <button
                        className='categories__action-btn categories__action-btn--add'
                        onClick={() => handleAddSubCategory(category)}
                        title='Thêm danh mục con'
                      >
                        <IoAddCircleOutline />
                      </button>
                      <button
                        className='categories__action-btn'
                        onClick={() => {
                          setEditingCategory(category)
                          setShowModal(true)
                        }}
                        title='Chỉnh sửa'
                      >
                        <IoCreateOutline />
                      </button>
                      <button
                        className='categories__action-btn categories__action-btn--danger'
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        title='Xóa'
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Level 2 SubCategories */}
                {expandedCategories.includes(category.id) && category.children?.length > 0 && (
                  <div className='categories__submenu'>
                    {category.children.map(sub => (
                      <div key={sub.id} className='categories__subitem-wrapper'>
                        <div className='categories__subitem'>
                          {/* Expand button for Level 3 */}
                          <button
                            className='categories__expand-btn-small'
                            onClick={() => toggleLevel2(sub.id)}
                            disabled={!sub.children?.length}
                          >
                            {sub.children?.length > 0 && (
                              expandedLevel2.includes(sub.id) 
                                ? <IoChevronUpOutline /> 
                                : <IoChevronDownOutline />
                            )}
                          </button>
                          <span className='categories__subitem-icon'><FaFolder /></span>
                          <span className='categories__subitem-label'>{sub.name}</span>
                          <span className='categories__subitem-slug'>/{sub.slug}</span>
                          <span className='categories__subitem-level'>Lv.{sub.level}</span>
                          {sub.children?.length > 0 && (
                            <span className='categories__subitem-count'>{sub.children.length} sub</span>
                          )}
                          <span className={`categories__status categories__status--${sub.isActive ? 'active' : 'inactive'}`}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <div className='categories__subitem-actions'>
                            {/* Add Level 3 */}
                            <button
                              className='categories__action-btn categories__action-btn--add'
                              onClick={() => handleAddSubCategory(sub)}
                              title='Thêm danh mục con'
                            >
                              <IoAddCircleOutline />
                            </button>
                            <button
                              className='categories__action-btn'
                              onClick={() => handleEditSubCategory(sub, category)}
                            >
                              <IoCreateOutline />
                            </button>
                            <button
                              className='categories__action-btn categories__action-btn--danger'
                              onClick={() => handleDeleteCategory(sub.id, sub.name)}
                            >
                              <IoTrashOutline />
                            </button>
                          </div>
                        </div>

                        {/* Level 3 Categories */}
                        {expandedLevel2.includes(sub.id) && sub.children?.length > 0 && (
                          <div className='categories__submenu categories__submenu--level3'>
                            {sub.children.map(level3 => (
                              <div key={level3.id} className='categories__subitem categories__subitem--level3'>
                                <span className='categories__subitem-icon'><FaFolder /></span>
                                <span className='categories__subitem-label'>{level3.name}</span>
                                <span className='categories__subitem-slug'>/{level3.slug}</span>
                                <span className='categories__subitem-level'>Lv.{level3.level}</span>
                                <span className={`categories__status categories__status--${level3.isActive ? 'active' : 'inactive'}`}>
                                  {level3.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <div className='categories__subitem-actions'>
                                  <button
                                    className='categories__action-btn'
                                    onClick={() => handleEditSubCategory(level3, sub)}
                                  >
                                    <IoCreateOutline />
                                  </button>
                                  <button
                                    className='categories__action-btn categories__action-btn--danger'
                                    onClick={() => handleDeleteCategory(level3.id, level3.name)}
                                  >
                                    <IoTrashOutline />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : !loading && (
        /* Grid View */
        <div className='categories__grid'>
          {categories.length === 0 ? (
            <div className='categories__empty'>
              <p>Không có danh mục nào</p>
            </div>
          ) : (
            categories.map(category => (
              <div key={category.id} className='categories__card'>
                <div className='categories__card-header'>
                  <span className='categories__card-icon'><FaFolder /></span>
                  <span className={`categories__status categories__status--${category.isActive ? 'active' : 'inactive'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className='categories__card-title'>{category.name}</h3>
                <p className='categories__card-description'>{category.description || 'Không có mô tả'}</p>
                <div className='categories__card-stats'>
                  <span className='categories__card-level'>Level {category.level}</span>
                  {category.children?.length > 0 && (
                    <span className='categories__card-subcats'>{category.children.length} subcategories</span>
                  )}
                </div>
                <div className='categories__card-actions'>
                  <button
                    className='categories__card-btn categories__card-btn--success'
                    onClick={() => handleAddSubCategory(category)}
                  >
                    <IoAddCircleOutline /> Add Sub
                  </button>
                  <button
                    className='categories__card-btn'
                    onClick={() => {
                      setEditingCategory(category)
                      setShowModal(true)
                    }}
                  >
                    <IoCreateOutline /> Edit
                  </button>
                  <button
                    className='categories__card-btn categories__card-btn--danger'
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                  >
                    <IoTrashOutline /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='categories__pagination'>
          <button
            className='categories__pagination-btn'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className='categories__pagination-info'>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className='categories__pagination-btn'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Add/Edit ROOT Category */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowModal(false)
            setEditingCategory(null)
          }}
          loading={loading}
          isRootOnly={true}
        />
      )}

      {/* Modal for Add/Edit SUB Category */}
      {showSubModal && (
        <SubCategoryModal
          category={editingCategory}
          parentCategory={parentForSub}
          allCategories={allCategories}
          onSave={handleSaveSubCategory}
          onClose={() => {
            setShowSubModal(false)
            setEditingCategory(null)
            setParentForSub(null)
          }}
          loading={loading}
        />
      )}
    </div>
  )
}

// ========== ROOT CATEGORY MODAL ==========
const CategoryModal = ({ category, onSave, onClose, loading, isRootOnly }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    isActive: category?.isActive !== undefined ? category.isActive : true
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        image: formData.image.trim() || null,
        isActive: formData.isActive
      })
    }
  }

  return (
    <div className='categories__modal-overlay' onClick={onClose}>
      <div className='categories__modal' onClick={(e) => e.stopPropagation()}>
        <div className='categories__modal-header'>
          <h2>{category ? 'Edit Category' : 'Add Root Category'}</h2>
          <button className='categories__modal-close' onClick={onClose}>×</button>
        </div>
        
        <form className='categories__modal-form' onSubmit={handleSubmit}>
          <div className='categories__form-group'>
            <label>Tên danh mục *</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='Nhập tên danh mục'
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className='categories__form-error'>{errors.name}</span>}
          </div>

          <div className='categories__form-group'>
            <label>Hình ảnh (URL)</label>
            <input
              type='text'
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder='Nhập URL hình ảnh'
            />
            {formData.image && (
              <div className='categories__image-preview'>
                <img src={formData.image} alt='Preview' onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div className='categories__form-group'>
            <label>Trạng thái</label>
            <div className='categories__form-toggle'>
              <label className='categories__toggle'>
                <input
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span className='categories__toggle-slider'></span>
              </label>
              <span>{formData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</span>
            </div>
          </div>

          <div className='categories__form-group'>
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder='Mô tả danh mục'
            />
          </div>

          <div className='categories__modal-footer'>
            <button type='button' className='categories__btn categories__btn--outline' onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type='submit' className='categories__btn categories__btn--primary' disabled={loading}>
              {loading ? 'Đang lưu...' : (category ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========== SUB CATEGORY MODAL ==========
const SubCategoryModal = ({ category, parentCategory, allCategories, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    parentId: category?.parentId || parentCategory?.id || '',
    isActive: category?.isActive !== undefined ? category.isActive : true
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc'
    }
    if (!formData.parentId) {
      newErrors.parentId = 'Vui lòng chọn danh mục cha'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        image: formData.image.trim() || null,
        parentId: parseInt(formData.parentId),
        isActive: formData.isActive
      })
    }
  }

  // Flatten categories for select
  const getAvailableParents = () => {
    const flatten = (cats, level = 0) => {
      let result = []
      cats.forEach(cat => {
        // Exclude current category if editing
        if (!category || cat.id !== category.id) {
          result.push({
            id: cat.id,
            name: cat.name,
            level: cat.level,
            displayName: '—'.repeat(level) + ' ' + cat.name
          })
          if (cat.children?.length > 0) {
            result = result.concat(flatten(cat.children, level + 1))
          }
        }
      })
      return result
    }
    return flatten(allCategories)
  }

  return (
    <div className='categories__modal-overlay' onClick={onClose}>
      <div className='categories__modal' onClick={(e) => e.stopPropagation()}>
        <div className='categories__modal-header'>
          <h2>
            {category ? 'Edit SubCategory' : `Add SubCategory`}
            {parentCategory && !category && (
              <span className='categories__modal-parent-info'>
                → {parentCategory.name}
              </span>
            )}
          </h2>
          <button className='categories__modal-close' onClick={onClose}>×</button>
        </div>
        
        <form className='categories__modal-form' onSubmit={handleSubmit}>
          <div className='categories__form-group'>
            <label>Tên danh mục con *</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='Nhập tên danh mục con'
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className='categories__form-error'>{errors.name}</span>}
          </div>

          <div className='categories__form-group'>
            <label>Danh mục cha *</label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className={errors.parentId ? 'error' : ''}
            >
              <option value=''>-- Chọn danh mục cha --</option>
              {getAvailableParents().map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.displayName} (Level {cat.level})
                </option>
              ))}
            </select>
            {errors.parentId && <span className='categories__form-error'>{errors.parentId}</span>}
          </div>

          <div className='categories__form-group'>
            <label>Hình ảnh (URL)</label>
            <input
              type='text'
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder='Nhập URL hình ảnh'
            />
            {formData.image && (
              <div className='categories__image-preview'>
                <img src={formData.image} alt='Preview' onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div className='categories__form-group'>
            <label>Trạng thái</label>
            <div className='categories__form-toggle'>
              <label className='categories__toggle'>
                <input
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span className='categories__toggle-slider'></span>
              </label>
              <span>{formData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</span>
            </div>
          </div>

          <div className='categories__form-group'>
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder='Mô tả danh mục con'
            />
          </div>

          <div className='categories__modal-footer'>
            <button type='button' className='categories__btn categories__btn--outline' onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type='submit' className='categories__btn categories__btn--primary' disabled={loading}>
              {loading ? 'Đang lưu...' : (category ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Categories
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = 'website';
const CLOUDINARY_CLOUD_NAME = 'djztk7ohs';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', slug: '' });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://rushsphere.onrender.com/api/categories?populate=subcategories');
      setCategories(res.data.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSlugChange = (type, value) => {
    const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    if (type === 'category') {
      setNewCategory((prev) => ({ ...prev, slug }));
    } else {
      setNewSubcategory((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
    console.log(res.data)
    return res.data.secure_url;
  };

  const handleAddCategory = async () => {
    try {
      let imageUrl = newCategory.image;
      if (imageFile) {
        imageUrl = await handleImageUpload();
      }

      const res = await axios.post('https://rushsphere.onrender.com/api/categories', {
        data: { ...newCategory, image: imageUrl },
      });

      console.log(res.data)
      setNewCategory({ name: '', slug: '', image: '' });
      setImageFile(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`https://rushsphere.onrender.com/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleAddSubcategory = async () => {
    if (!selectedCategoryId) return;
    try {
      await axios.post('https://rushsphere.onrender.com/api/subcategories', {
        data: { ...newSubcategory, category: selectedCategoryId },
      });
      setNewSubcategory({ name: '', slug: '' });
      fetchCategories();
    } catch (err) {
      alert('Failed to add subcategory');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await axios.delete(`https://rushsphere.onrender.com/api/subcategories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete subcategory');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Categories & Subcategories</h2>

      {/* Add New Category */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          onBlur={() => handleSlugChange('category', newCategory.name)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Category Slug"
          value={newCategory.slug}
          onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </div>

      {/* Add New Subcategory */}
      <div className="mb-6">
        <select
          value={selectedCategoryId ?? ''}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Subcategory Name"
          value={newSubcategory.name}
          onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
          onBlur={() => handleSlugChange('subcategory', newSubcategory.name)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Subcategory Slug"
          value={newSubcategory.slug}
          onChange={(e) => setNewSubcategory({ ...newSubcategory, slug: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddSubcategory} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Subcategory
        </button>
      </div>

      {/* Categories List */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Subcategories</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="px-6 py-4 font-medium">
                    <p>{cat.name}</p>
                    <p className="text-xs text-gray-500">{cat.slug}</p>
                    {cat.image && (
                      <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover mt-2 rounded" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {cat.subcategories.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id} className="flex justify-between items-center">
                            <div>
                              {sub.name} <span className="text-xs text-gray-500">({sub.slug})</span>
                            </div>
                            <button
                              onClick={() => handleDeleteSubcategory(sub.id)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No subcategories</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete Category
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;


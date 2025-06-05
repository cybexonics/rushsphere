import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://rushsphere.onrender.com/api/categories?populate=subcategories');
      const data = res.data.data.map((item: any) => ({
        id: item.id,
        name: item.attributes.name,
        subcategories: item.attributes.subcategories.data.map((sub: any) => ({
          id: sub.id,
          name: sub.attributes.name,
        })),
      }));
      setCategories(data);
    } catch (err: any) {
      setError('Failed to fetch categories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      await axios.post('https://rushsphere.onrender.com/api/categories', {
        data: { name: newCategory },
      });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      alert('Failed to add category');
    }
  };

  const handleAddSubcategory = async () => {
    if (!selectedCategoryId) return;
    try {
      const subRes = await axios.post('https://rushsphere.onrender.com/api/subcategories', {
        data: { name: newSubcategory, category: selectedCategoryId },
      });
      setNewSubcategory('');
      fetchCategories();
    } catch (err) {
      alert('Failed to add subcategory');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Categories & Subcategories</h2>

      {/* Form to add new category */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </div>

      {/* Form to add new subcategory */}
      <div className="mb-6">
        <select
          value={selectedCategoryId ?? ''}
          onChange={e => setSelectedCategoryId(Number(e.target.value))}
          className="border p-2 mr-2"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Subcategory Name"
          value={newSubcategory}
          onChange={e => setNewSubcategory(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddSubcategory} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Subcategory
        </button>
      </div>

      {/* Table showing all categories */}
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
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-t">
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4">
                    {cat.subcategories.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {cat.subcategories.map(sub => (
                          <li key={sub.id}>{sub.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No subcategories</span>
                    )}
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

